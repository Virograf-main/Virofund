import Image from 'next/image'
import React from 'react'

type SmallPfpType = {
    image?: string
    alt?: string
}

const SmallPfp = ({ props, className = "", size }: { props?: SmallPfpType, className?: string, size?: number }) => {
  return (
    <div
      className={`rounded-full relative ${className}`}
      style={size ? { width: size, height: size } : {}}
    >
      {props?.image ? (
        <Image
          src={props.image}
          alt={props.alt || ""}
          fill
          className="object-cover rounded-full"
        />
      ) : (
        <div className="rounded-full bg-input w-full h-full" />
      )}
    </div>
  );
};


export default SmallPfp