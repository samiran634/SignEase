import React from 'react'

export const HeroContent = ({ title, subtitle, titleId }) => {
  return (
    <div className="flex flex-col flex-1 mt-20">
      <h1 id={titleId} className="text-5xl font-bold">
        {title}
      </h1>
      <p className="mt-4 text-2xl">
        {subtitle}
      </p>
    </div>
  )
}
