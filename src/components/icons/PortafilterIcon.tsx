import clsx from "clsx";

interface IconProps {
  className?: string;
}

export const PortafilterIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={clsx("fill-current", className)}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    // style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
  >
    <path
      d="m110.13 470.38 49.492 49.492a17.502 17.502 0 0 0 12.373 5.126c4.639 0 9.093-1.845 12.373-5.126l185.61-185.61a17.494 17.494 0 0 0 0-24.746l-12.371-12.371 30.41-30.41v-.004c31.207 22.827 71.964 28.303 108.09 14.523 36.128-13.779 62.886-45.007 70.965-82.82a114.172 114.172 0 0 0-30.918-104.59c-27.371-27.367-66.742-39.008-104.59-30.918-37.813 8.078-69.042 34.837-82.82 70.965-13.78 36.126-8.304 76.883 14.523 108.09l-30.41 30.41-12.371-12.37h-.004a17.502 17.502 0 0 0-12.373-5.126 17.502 17.502 0 0 0-12.373 5.126l-185.61 185.61a17.503 17.503 0 0 0-5.127 12.373c0 4.639 1.846 9.093 5.127 12.373l.004.003Zm455-220.25-35 35a17.505 17.505 0 0 0-5.345 12.588 17.502 17.502 0 0 0 17.499 17.499c4.745 0 9.292-1.931 12.588-5.345l35-35c4.293-4.445 5.926-10.824 4.293-16.785a17.538 17.538 0 0 0-12.25-12.25c-5.96-1.633-12.34 0-16.785 4.293ZM344.87 99.871l35-35a17.505 17.505 0 0 0 5.345-12.588 17.502 17.502 0 0 0-17.499-17.499 17.505 17.505 0 0 0-12.588 5.345l-35 35a17.503 17.503 0 0 0-5.345 12.588A17.5 17.5 0 0 0 344.87 99.87v.001Z"
      // style="fill-rule:nonzero"
      transform="matrix(.03429 0 0 .03429 -1.996 .404)"
    />
  </svg>
);

/*
Attribution 
Portafilter by ghufronagustian from <a href="https://thenounproject.com/browse/icons/term/portafilter/" target="_blank" title="Portafilter Icons">Noun Project</a>
https://thenounproject.com/icon/portafilter-4343476/

Rescaled to 24px and then made 20px anchored to the centre
*/
