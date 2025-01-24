import React from 'react'

const Card = ({ children, className }) => (
  <div className={`rounded-lg ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)

const AspectRatio = ({ children, ratio = 1 }) => (
  <div style={{ position: 'relative', paddingBottom: `${100 / ratio}%` }}>
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      {children}
    </div>
  </div>
)

const devices = {
  image: {
    src: "../../public/assets/hero-image.png",  
    alt: "3D mockup scene featuring Apple devices including a notebook, tablet and phone with sleek minimal design",
  },
};

export const HeroImage = ({ src, alt }) => {
  return (
    <Card className="w-[592px] border-none shadow-none">
      <CardContent className="p-0">
        <AspectRatio ratio={592 / 468}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  )
}

export default function DevicesShowcase() {
  return (
    <Card className="w-[592px] border-none shadow-none">
      <CardContent className="p-0">
        <AspectRatio ratio={592 / 468}>
          <img
            src={devices.image.src}
            alt={devices.image.alt}
            className="w-full h-full object-cover rounded-lg"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
}
