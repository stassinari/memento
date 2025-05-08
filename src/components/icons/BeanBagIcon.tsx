import clsx from "clsx";

interface IconProps {
  variant: "outline" | "solid";
  className?: string;
}

export const BeanBagIcon: React.FC<IconProps> = ({ className, variant }) =>
  variant === "solid" ? (
    <svg
      className={clsx("fill-current", className)}
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
      className={clsx("fill-current", className)}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
    >
      <path
        d="M457.596 168.373 428.5 88.361V31c0-8.229-6.771-15-15-15h-315c-8.229 0-15 6.771-15 15v57.361l-29.095 80.012a14.92 14.92 0 0 0-.905 5.127V481c0 8.229 6.771 15 15 15h375c8.229 0 15-6.771 15-15V173.5a14.942 14.942 0 0 0-.904-5.127ZM398.5 76h-78.75V46h78.75v30ZM289.75 46v97.5h-67.5V46h67.5ZM113.5 46h78.75v30H113.5V46Zm315 420h-345V176.144L109.007 106h83.243v52.5c0 8.229 6.771 15 15 15h97.5c8.229 0 15-6.771 15-15V106h83.243l25.507 70.144V466Z"
        transform="matrix(.03697 0 0 .03697 .537 .537)"
      />
      <path
        d="M314.209 269.041c-37.8-37.8-94.665-42.451-126.767-10.349-.16.159-.304.329-.462.49-.031.034-.065.066-.095.101-31.468 32.196-26.671 88.6 10.906 126.176 20.925 20.926 47.684 31.689 72.857 31.689 20.303 0 39.58-7.006 53.91-21.339.16-.16.304-.33.462-.49.031-.035.065-.067.095-.102 31.469-32.195 26.671-88.599-10.906-126.176Zm-72.791-1.853c17.343 0 36.434 7.921 51.58 23.064 17.589 17.588 25.386 40.484 22.396 59.803a94.707 94.707 0 0 0-11.076-13.174c-17.432-17.431-32.549-21.181-44.718-24.195-10.712-2.652-19.175-4.746-30.71-16.286-8.139-8.141-11.573-14.752-13.823-21.699a47.306 47.306 0 0 1 26.351-7.513Zm-22.416 97.06c-17.588-17.588-25.386-40.485-22.395-59.803a94.583 94.583 0 0 0 11.068 13.166c17.439 17.443 32.563 21.186 44.729 24.196 10.708 2.655 19.167 4.753 30.7 16.285 8.124 8.126 11.563 14.726 13.814 21.654-21.232 14.076-54.332 8.084-77.916-15.498Z"
        transform="matrix(.03697 0 0 .03697 .537 .537)"
      />
    </svg>
  );

/*
Attribution

Outline

coffee bag by Chanut is Industries from <a href="https://thenounproject.com/browse/icons/term/coffee-bag/" target="_blank" title="coffee bag Icons">Noun Project</a>
https://thenounproject.com/icon/coffee-bag-3485299/
  
Rescaled to 24px and then made 20px anchored to the centre

Solid

paper bag by Andi Nur Abdillah from <a href="https://thenounproject.com/browse/icons/term/paper-bag/" target="_blank" title="paper bag Icons">Noun Project</a>
https://thenounproject.com/icon/paper-bag-1981402/

*/
