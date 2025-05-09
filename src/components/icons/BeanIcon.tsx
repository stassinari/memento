import clsx from "clsx";

interface IconProps {
  className?: string;
}

export const BeanIcon = ({ className }: IconProps) => (
  <svg
    className={clsx("fill-current", className)}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    // style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
  >
    <path
      d="M303.7 154.64c-.234-30.531 5.441-60.816 17.684-89.27 4.984-11.594 17-21.941 1.125-25.879-7.555-1.887-20.395 3.332-27.492 6.043-79.789 30.52-137.9 123.28-137.9 233.02 0 115.83 64.68 212.77 151.34 237.56 27.203 7.785 44.582 6.758 55.988-20.777 4.844-11.637 8.309-23.883 10.129-37.469a208.746 208.746 0 0 0 1.895-28.043c0-38.871-10.656-76.539-28.027-110.31-27.277-53.016-44.746-109.34-44.746-164.88l.004.005Zm141.67-90.066c-13.215-9.078-33.699-23.234-50.02-14.996-12.312 6.227-20.406 24.129-25.535 36.18-9.141 21.391-13.156 44.402-13.441 68.875 0 44.246 14.348 93.211 38.902 140.7 20.699 40.125 33.852 85.949 33.852 134.5 0 11.531-.762 23.199-2.273 34.984-1.211 9.152-9.891 24.707-6.196 33.543 6.352 15.191 27.281-7.207 35.75-13.938 54.555-43.176 90.664-119.18 90.664-205.86.004-92.367-41.098-172.68-101.7-213.98l-.003-.008Z"
      //   style="fill-rule:nonzero"
      transform="matrix(.03429 0 0 .03429 -2.072 .41)"
    />
  </svg>
);

/*
Attribution 
Coffee Bean by Krish from <a href="https://thenounproject.com/browse/icons/term/coffee-bean/" target="_blank" title="Coffee Bean Icons">Noun Project</a>
https://thenounproject.com/icon/coffee-bean-120176/

Rescaled to 24px and then made 20px anchored to the centre
*/
