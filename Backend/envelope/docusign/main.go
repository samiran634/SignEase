package main

import (
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "net/url"
    "os"
    "strings"
    "time"

    "github.com/golang-jwt/jwt"
    "github.com/gorilla/mux"
)

type AccessToken struct {
    Token  string `json:"access_token"`
    Type   string `json:"token_type"`
    Expiry int    `json:"expires_in"`
}

type AccountId struct {
    Sub      string `json:"sub"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Accounts []struct {
        AccountID    string `json:"account_id"`
        IsDefault    bool   `json:"is_default"`
        AccountName  string `json:"account_name"`
        BaseURI      string `json:"base_uri"`
    } `json:"accounts"`
}

type EnvelopeID struct {
    EnvelopeID     string    `json:"envelopeId"`
    URI            string    `json:"uri"`
    StatusDateTime time.Time `json:"statusDateTime"`
    Status         string    `json:"status"`
}

type SigningRequest struct {
    CCName      string `json:"ccName"`
    CCEmail     string `json:"ccEmail"`
    SignerEmail string `json:"signerEmail"`
    SignerName  string `json:"signerName"`
}

type DocuSignConfig struct {
    IntegrationKey      string
    ImpersonatedUserGUID string
    PrivateKeyPath      string
}

var config DocuSignConfig

func makeDSToken() (string, error) {
    rawJWT := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
        "iss":   config.IntegrationKey,
        "sub":   config.ImpersonatedUserGUID,
        "iat":   time.Now().Unix(),
        "exp":   time.Now().Unix() + 3600,
        "aud":   "account-d.docusign.com",
        "scope": "signature impersonation",
    })

    privateKeyBytes, err := os.ReadFile(config.PrivateKeyPath)
    if err != nil {
        return "", fmt.Errorf("failed to read private key: %v", err)
    }

    rsaPrivate, err := jwt.ParseRSAPrivateKeyFromPEM(privateKeyBytes)
    if err != nil {
        return "", fmt.Errorf("failed to parse private key: %v", err)
    }

    tokenString, err := rawJWT.SignedString(rsaPrivate)
    if err != nil {
        return "", fmt.Errorf("failed to sign token: %v", err)
    }

    resp, err := http.PostForm("https://account-d.docusign.com/oauth/token",
        url.Values{
            "grant_type": {"urn:ietf:params:oauth:grant-type:jwt-bearer"},
            "assertion":  {tokenString},
        })
    if err != nil {
        return "", fmt.Errorf("token request failed: %v", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %v", err)
    }

    var token AccessToken
    if err := json.Unmarshal(body, &token); err != nil {
        return "", fmt.Errorf("failed to decode token: %v", err)
    }

    return token.Token, nil
}

func getAPIAccId(DSAccessToken string) (string, error) {
    client := &http.Client{}
    req, err := http.NewRequest("GET", "https://account-d.docusign.com/oauth/userinfo", nil)
    if err != nil {
        return "", fmt.Errorf("request creation failed: %v", err)
    }
    req.Header.Set("Authorization", "Bearer "+DSAccessToken)

    res, err := client.Do(req)
    if err != nil {
        return "", fmt.Errorf("request failed: %v", err)
    }
    defer res.Body.Close()

    body, err := io.ReadAll(res.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %v", err)
    }

    var accountId AccountId
    if err := json.Unmarshal(body, &accountId); err != nil {
        return "", fmt.Errorf("failed to decode account info: %v", err)
    }

    return accountId.Accounts[0].AccountID, nil
}

func makeEnvelope(ccName, ccEmail, signerEmail, signerName string) string {
    envelope := fmt.Sprintf(`{
        "emailSubject": "Please sign this document set",
        "documents": [{
            "documentBase64": "DQoNCg0KCQkJCXRleHQgZG9jDQoNCg0KDQoNCg0KUk0gIwlSTSAjCVJNICMNCg0KDQoNClxzMVwNCg0KLy9hbmNoMSANCgkvL2FuY2gyDQoJCS8vYW5jaDM=",
            "documentId": "1",
            "fileExtension": "txt",
            "name": "NDA"
        }],
        "recipients": {
            "carbonCopies": [
                {
                    "email": "%s",
                    "name": "%s",
                    "recipientId": "2",
                    "routingOrder": "2"
                }
            ],
            "signers": [
                {
                    "email": "%s",
                    "name": "%s",
                    "recipientId": "1",
                    "routingOrder": "1",
                    "tabs": {
                        "signHereTabs": [{
                            "documentId": "1",
                            "name": "SignHereTab",
                            "pageNumber": "1",
                            "recipientId": "1",
                            "tabLabel": "SignHereTab",
                            "xPosition": "75",
                            "yPosition": "572"
                        }]
                    }
                }
            ]
        },
        "status": "sent"
    }`, ccEmail, ccName, signerEmail, signerName)

    return envelope
}

func sendEnvelope(DSAccessToken, DSAccountId, envelopeDefinition string) (string, error) {
    client := &http.Client{}
    req, err := http.NewRequest("POST", 
        "https://demo.docusign.net/restapi/v2.1/accounts/"+DSAccountId+"/envelopes", 
        strings.NewReader(envelopeDefinition))
    if err != nil {
        return "", fmt.Errorf("request creation failed: %v", err)
    }
    req.Header.Set("Authorization", "Bearer "+DSAccessToken)
    req.Header.Set("Content-Type", "application/json")

    res, err := client.Do(req)
    if err != nil {
        return "", fmt.Errorf("request failed: %v", err)
    }
    defer res.Body.Close()

    body, err := io.ReadAll(res.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %v", err)
    }

    var envelope EnvelopeID
    if err := json.Unmarshal(body, &envelope); err != nil {
        return "", fmt.Errorf("failed to decode envelope response: %v", err)
    }

    return envelope.EnvelopeID, nil
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Allow all origins during development
        w.Header().Set("Access-Control-Allow-Origin", "*")
        
        // Allow specific HTTP methods
        w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        
        // Allow specific headers
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Continue to the next handler
        next.ServeHTTP(w, r)
    }
}

func sendDocuSignEnvelope(w http.ResponseWriter, r *http.Request) {
    var request SigningRequest
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        log.Printf("Decoding error: %v", err)
        http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
        return
    }

    // Validate input
    if request.SignerEmail == "" || request.SignerName == "" {
        http.Error(w, "Signer email and name are required", http.StatusBadRequest)
        return
    }

    accessToken, err := makeDSToken()
    if err != nil {
        log.Printf("Access token error: %v", err)
        http.Error(w, fmt.Sprintf("Failed to get access token: %v", err), http.StatusInternalServerError)
        return
    }

    accountId, err := getAPIAccId(accessToken)
    if err != nil {
        log.Printf("Account ID error: %v", err)
        http.Error(w, fmt.Sprintf("Failed to get account ID: %v", err), http.StatusInternalServerError)
        return
    }

    envelopeDefinition := makeEnvelope(
        request.CCName, 
        request.CCEmail, 
        request.SignerEmail, 
        request.SignerName,
    )

    envelopeId, err := sendEnvelope(accessToken, accountId, envelopeDefinition)
    if err != nil {
        log.Printf("Envelope send error: %v", err)
        http.Error(w, fmt.Sprintf("Failed to send envelope: %v", err), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    
    // Ensure JSON response
    response := map[string]string{"envelopeId": envelopeId}
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("JSON encoding error: %v", err)
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
        return
    }
}

func main() {
    config = DocuSignConfig{
        IntegrationKey:      "364a8cfc-0945-435c-b539-a4dde70a7e6d",
        ImpersonatedUserGUID: "a689ea9d-5208-4b2c-bf9c-a9870501d6dc",
        PrivateKeyPath:      "private.key",
    }

    r := mux.NewRouter()
    // r.Use(corsMiddleware)

    r.HandleFunc("/send-envelope", corsMiddleware(sendDocuSignEnvelope)).Methods("POST", "OPTIONS")
    r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("DocuSign Integration Server"))
    })

    port := ":8080"
    log.Printf("Server starting on port %s", port)
    log.Fatal(http.ListenAndServe(port, r))
}