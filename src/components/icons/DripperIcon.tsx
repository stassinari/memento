import "twin.macro";

interface IconProps {
  className?: string;
}

export const DripperIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    tw="fill-current"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    // style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
  >
    <path
      d="M175 472.5c0 4.641 1.844 9.094 5.125 12.375A17.504 17.504 0 0 0 192.5 490h245c4.641 0 9.094-1.844 12.375-5.125A17.504 17.504 0 0 0 455 472.5v-56.875H175V472.5ZM542.5 70h-420a17.49 17.49 0 0 0-13.648 6.551 17.508 17.508 0 0 0-3.434 14.742l66.242 298.08h75.973l-15.656-125.24a13.135 13.135 0 0 1 11.368-14.84 13.13 13.13 0 0 1 14.679 11.574l16.062 128.51h27.789v-179.38c0-7.25 5.875-13.125 13.125-13.125s13.125 5.875 13.125 13.125v179.38h27.789l16.062-128.51c.996-7.109 7.512-12.102 14.633-11.207 7.121.891 12.207 7.34 11.414 14.473l-15.648 125.24h75.973l63.188-284.38h20.965a17.526 17.526 0 0 1 17.5 17.5v52.5a17.498 17.498 0 0 0 26.25 15.156 17.498 17.498 0 0 0 8.75-15.156v-52.5a52.548 52.548 0 0 0-15.395-37.105 52.552 52.552 0 0 0-37.105-15.395L542.5 70Z"
      //   style="fill-rule:nonzero"
      transform="matrix(.03429 0 0 .03429 -2 .4)"
    />
  </svg>
);

/*
Attribution 
dripper by ghufronagustian from <a href="https://thenounproject.com/browse/icons/term/dripper/" target="_blank" title="dripper Icons">Noun Project</a>
https://thenounproject.com/icon/dripper-4343465/

Rescaled to 24px and then made 20px anchored to the centre
*/
