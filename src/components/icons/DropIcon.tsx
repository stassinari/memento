import "twin.macro";

interface IconProps {
  className?: string;
}

export const DropIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    tw="fill-current"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
  >
    <path
      d="M477.74 338.54a125.88 125.88 0 0 0-4.391-28.844c-22.676-94.578-123.33-230.43-123.33-230.43s-100.65 135.85-123.32 230.42c-19.852 73.449 27.531 144.82 98.066 159.03 82.18 16.414 156.31-48.859 152.98-130.18l-.005.004Z"
      transform="matrix(.04206 0 0 .04206 -4.722 -1.578)"
    />
  </svg>
);

/*
Attribution 
drop by 1art from <a href="https://thenounproject.com/browse/icons/term/drop/" target="_blank" title="drop Icons">Noun Project</a>
https://thenounproject.com/icon/drop-4703105/

Rescaled to 24px and then made 20px anchored to the centre
*/
