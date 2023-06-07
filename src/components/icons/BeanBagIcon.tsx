import "twin.macro";

interface IconProps {
  variant: "outline" | "solid";
  className?: string;
}

export const BeanBagIcon: React.FC<IconProps> = ({ className, variant }) =>
  variant === "solid" ? (
    <svg
      className={className}
      tw="fill-current"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <path
        d="M43.71 59.93h4.36a3.306 3.306 0 0 0 3.29-3.29V26.78l-4.25-15.3-3.4 15.27v33.18Z"
        transform="matrix(.3 0 0 .3 .403 .4)"
      />
      <path
        d="M15.93 59.93h25.78V26.64a1.011 1.011 0 0 1 0-.22l4-18.07h-29l-4.09 18.4v29.89a3.306 3.306 0 0 0 3.29 3.29h.02ZM46 5.07c0-.549-.451-1-1-1H17.93c-.549 0-1 .451-1 1v1.29H46V5.07Z"
        transform="matrix(.3 0 0 .3 .403 .4)"
      />
    </svg>
  ) : (
    <svg
      className={className}
      tw="fill-current"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <path
        d="M14.5 16h-4a.5.5 0 0 1-.5-.5V7.444c0-.694.164-1.39.475-2.012l1.578-3.155c.17-.339.725-.339.895 0l1.578 3.155c.31.622.474 1.318.474 2.012V15.5a.5.5 0 0 1-.5.5ZM11 15h3V7.444c0-.54-.128-1.082-.369-1.566L12.5 3.618l-1.131 2.261A3.526 3.526 0 0 0 11 7.444V15Z"
        transform="translate(1.5 2)"
      />
      <path
        d="M10.5 16h-8a.5.5 0 0 1-.5-.5V7.444c0-.693.164-1.389.474-2.012l1.579-3.156a.5.5 0 0 1 .895.448L3.369 5.878A3.54 3.54 0 0 0 3 7.444V15h7.5a.5.5 0 0 1 0 1Z"
        transform="translate(1.5 2)"
      />
      <path
        d="M12.5 3a.5.5 0 0 1-.5-.5V1H5v1.5a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5ZM6.5 14C5.122 14 4 12.654 4 11s1.122-3 2.5-3S9 9.346 9 11s-1.122 3-2.5 3Zm0-5C5.673 9 5 9.897 5 11s.673 2 1.5 2S8 12.103 8 11s-.673-2-1.5-2Z"
        transform="translate(1.5 2)"
      />
      <path
        d="M6.5 14a.5.5 0 0 1-.461-.695c.154-.365.463-1.438.053-2.015-.806-1.132-.132-2.8-.052-2.986a.5.5 0 0 1 .92.391c-.154.365-.463 1.438-.053 2.015.807 1.132.132 2.8.053 2.986A.5.5 0 0 1 6.5 14Z"
        transform="translate(1.5 2)"
      />
    </svg>
  );

/*
Attribution

Outline

coffee bag by icon 54 from <a href="https://thenounproject.com/browse/icons/term/coffee-bag/" target="_blank" title="coffee bag Icons">Noun Project</a>
https://thenounproject.com/icon/coffee-bag-1507036/
  
Rescaled to 24px and then made 20px anchored to the centre

Solid

paper bag by Andi Nur Abdillah from <a href="https://thenounproject.com/browse/icons/term/paper-bag/" target="_blank" title="paper bag Icons">Noun Project</a>
https://thenounproject.com/icon/paper-bag-1981402/

*/
