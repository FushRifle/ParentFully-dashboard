import Image from 'next/image'
import React from 'react'

type ParentfullyIconProps = {
     size?: number
     className?: string
     priority?: boolean
}

export const ParentfullyIcon = ({
     size = 35,
     className,
     priority = false,
}: ParentfullyIconProps) => {
     return (
          <Image
               src="/icons/ParentFully.png"
               alt="Parentfully"
               width={size}
               height={size}
               priority={priority}
               className={className}
          />
     )
}
