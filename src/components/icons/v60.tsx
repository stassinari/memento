import React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

function V60Icon2(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      {/* <path
        d="M20.976 15.396h-4.128l5.04-9.168c.168-.312.168-.72-.024-1.032a1.047 1.047 0 00-.888-.504H3.024c-.36 0-.72.192-.888.504-.192.312-.192.72-.024 1.032l5.04 9.168H3.024c-.576 0-1.032.456-1.032 1.032 0 .576.456 1.032 1.032 1.032H5.52v.816c0 .576.456 1.032 1.032 1.032H17.4c.576 0 1.032-.456 1.032-1.032v-.792h2.496c.576 0 1.032-.456 1.032-1.032 0-.576-.408-1.056-.984-1.056zM4.8 6.78h14.4l-4.728 8.616H9.528L4.8 6.78z"
        fillRule="nonzero"
      /> */}
      {/* <g transform="matrix(0.0685714,0,0,0.0685714,-5.92088,-5.21829)">
        <path d="M367.6,146.7C367,145.7 365.8,145.1 364.6,145.1L158,145.1C156.8,145.1 155.7,145.7 155,146.7C154.4,147.7 154.3,148.9 154.8,149.9L213.4,267C214,268.2 215.2,268.9 216.6,268.9L306.1,268.9C307.5,268.9 308.7,268.2 309.3,267L367.9,149.9C368.4,148.9 368.3,147.7 367.6,146.7Z" />
        <g>
          <path d="M359.3,278.3L163.3,278.3C161.9,278.3 160.8,277.2 160.8,275.8C160.8,274.4 161.9,273.3 163.3,273.3L359.3,273.3C360.7,273.3 361.8,274.4 361.8,275.8C361.8,277.2 360.7,278.3 359.3,278.3Z" />
        </g>
        <path d="M331,283.4L191.7,283.4C189.8,283.4 188.2,284.7 188.2,286.3L188.2,305.7C188.2,307.3 189.8,308.6 191.7,308.6L331,308.6C332.9,308.6 334.5,307.3 334.5,305.7L334.5,286.3C334.5,284.7 332.9,283.4 331,283.4Z" />
        <path d="M263.9,329.5C263.2,328.8 262.3,328.4 261.3,328.4C260.3,328.4 259.4,328.8 258.7,329.5C255.9,332.5 231.5,359.3 231.5,374.7C231.5,391.1 244.9,404.5 261.3,404.5C277.7,404.5 291.1,391.1 291.1,374.7C291.2,359.3 266.7,332.5 263.9,329.5Z" />
        <path d="M359.9,106.5C359.4,105.6 358.4,105 357.3,104.9C356.8,104.8 307.2,97.7 261.3,97.7C216,97.7 165.8,104.8 165.3,104.8C164.2,105 163.2,105.6 162.7,106.4C162.2,107.2 162.2,108.3 162.8,109.1L181.2,138.5C181.8,139.5 183,140.1 184.3,140.1L338.4,140.1C339.7,140.1 340.9,139.5 341.5,138.5L359.9,109.1C360.4,108.4 360.4,107.3 359.9,106.5Z" />
      </g> */}
      {/* <g transform="matrix(0.282353,0,0,0.282353,-2.11765,-2.11765)">
        <path d="M84.9,81.3L75.4,50.8L78,50.8C78.8,50.8 79.5,50.1 79.5,49.3C79.5,48.5 78.8,47.8 78,47.8L65.2,47.8L79.3,22.1C79.6,21.6 79.5,21.1 79.3,20.6C79,20.2 78.5,20 78,20L74.9,20L76.9,16.7C77.1,16.3 77.2,15.9 77,15.5C76.9,15.1 76.5,14.8 76.1,14.6C69.5,12.1 62.1,10.7 54.6,10.7C47.1,10.7 39.6,12 33.1,14.6C32.7,14.8 32.4,15.1 32.2,15.5C32.1,15.9 32.1,16.4 32.3,16.7L34.3,20L31.2,20C30.7,20 30.2,20.3 29.9,20.7C29.6,21.1 29.6,21.7 29.9,22.2L44,47.9L31.2,47.9C30.4,47.9 29.7,48.6 29.7,49.4C29.7,50.2 30.4,50.9 31.2,50.9L33.8,50.9L32.7,54.3L28,54.3C20.7,54.3 14.8,60.2 14.8,67.5C14.8,73.6 19,78.8 24.7,80.2L24.3,81.4C24.3,81.5 24.3,81.6 24.2,81.6C23.9,83.6 24.5,85.6 25.8,87.1C27.1,88.6 29,89.5 31,89.5L78,89.5C80,89.5 81.9,88.6 83.2,87.1C84.5,85.6 85.1,83.6 84.8,81.6C85,81.4 85,81.4 84.9,81.3ZM78.2,86.4L31.2,86.4C30.1,86.4 29,85.9 28.2,85C27.5,84.2 27.1,83.1 27.3,82L37,50.8L39.1,50.8L39.1,54C39.1,54.8 39.8,55.5 40.6,55.5L68.8,55.5C69.6,55.5 70.3,54.8 70.3,54L70.3,50.7L72.5,50.7L82.1,82C82.2,83.1 81.9,84.2 81.2,85C80.4,85.9 79.3,86.4 78.2,86.4ZM28.1,57.1L31.9,57.1L25.7,77.2C21.2,76.1 17.9,72.1 17.9,67.3C17.9,61.7 22.5,57.1 28.1,57.1ZM66.3,14.7L65.8,15.7C65.6,16.1 65.7,16.5 66.1,16.7C66.2,16.8 66.3,16.8 66.5,16.8C66.8,16.8 67,16.7 67.1,16.4L67.9,15C69.8,15.4 71.7,16 73.5,16.6L71.5,19.9L65.2,19.9L65.7,18.9C65.9,18.5 65.8,18.1 65.4,17.9C65,17.7 64.6,17.8 64.4,18.2L63.5,20L37.9,20L35.9,16.7C41.7,14.7 48.2,13.7 54.7,13.7C58.6,13.6 62.5,14 66.3,14.7ZM75.5,22.9L61.8,47.8L47.5,47.8L33.8,22.9L75.5,22.9ZM42,50.8L67.2,50.8L67.2,52.6L42,52.6L42,50.8Z" />
        <path d="M74.8,72.5C74.6,71.9 74,71.5 73.4,71.5L36,71.5C35.4,71.5 34.8,71.9 34.6,72.5L32.6,78.8C32.3,79.8 32.5,80.9 33.1,81.8C33.7,82.7 34.7,83.2 35.8,83.2L73.4,83.2C74.5,83.2 75.5,82.7 76.1,81.8C76.7,80.9 76.9,79.8 76.6,78.8L74.8,72.5ZM73.9,80.1C73.8,80.2 73.7,80.3 73.5,80.3L35.9,80.3C35.7,80.3 35.6,80.2 35.5,80.1C35.4,80 35.4,79.9 35.4,79.7L37,74.4L72.2,74.4L73.8,79.7C74,79.9 73.9,80.1 73.9,80.1Z" />
      </g> */}
      <g transform="matrix(0.24,0,0,0.24,0,0)">
        <path d="M94.018,25.805C90.496,23.13 85.194,23.387 82,23.876C82.401,23.2 82.781,22.571 83.132,22.004C84.263,20.18 85.07,18.679 84.348,17.313C83.512,15.733 81.382,15.576 76.969,15.393L10.092,15.393C5.739,15.576 3.61,15.733 2.774,17.313C2.052,18.679 2.859,20.18 3.992,22.004C10.779,32.957 27.72,65.437 27.89,65.765L27.932,65.838C28.598,66.955 28.872,67.876 28.682,68.369C28.471,68.919 27.497,69.221 26.854,69.421L26.771,69.447C24.657,70.101 21.31,70.757 18.074,71.385C9.935,72.965 7.803,73.458 7.766,75.322C7.757,75.793 7.945,76.251 8.294,76.609C8.774,77.097 9.838,78.179 22.406,78.721C22.823,80.453 24.177,84.608 27.61,84.608L59.51,84.608C62.914,84.608 64.274,80.528 64.703,78.764C65.143,78.751 65.582,78.734 66.015,78.712C77.43,78.205 79.355,77.268 79.355,75.347C79.355,73.462 77.218,72.969 69.047,71.381C65.81,70.752 62.462,70.102 60.348,69.447L60.265,69.421C59.621,69.221 58.649,68.919 58.439,68.369C58.25,67.876 58.524,66.955 59.192,65.838L59.231,65.765C59.296,65.642 61.743,60.952 65.128,54.567C66.4,54.24 73.588,52.324 80.897,49.143C91.914,44.351 97.5,39.171 97.5,33.747C97.5,30.23 96.328,27.559 94.018,25.805ZM59.511,81.727L27.611,81.727C26.732,81.727 26.016,80.462 25.565,79.222L61.56,79.222C61.095,80.483 60.364,81.727 59.511,81.727ZM56.698,64.398C55.529,66.371 55.219,68.006 55.752,69.399C56.463,71.253 58.383,71.851 59.415,72.17L59.493,72.192C61.761,72.899 65.186,73.562 68.498,74.208C70.135,74.526 72.079,74.902 73.688,75.264C70.119,75.709 62.681,76.146 47.241,76.146L45.275,76.146C44.406,76.146 43.797,76.146 43.549,76.155C43.547,76.155 42.571,76.16 40.95,76.16C27.254,76.16 18.239,75.75 13.668,75.217C15.23,74.868 17.067,74.51 18.623,74.209C21.935,73.567 25.358,72.9 27.625,72.193L27.704,72.171C28.736,71.853 30.658,71.255 31.37,69.4C31.902,68.007 31.595,66.372 30.423,64.399C30.34,64.242 29.996,63.583 29.448,62.536L35.455,62.536C36.24,62.536 36.877,61.898 36.877,61.118C36.877,60.332 36.24,59.695 35.455,59.695L27.958,59.695C26.455,56.841 24.393,52.935 22.095,48.637L41.863,48.637C42.646,48.637 43.283,48 43.283,47.215C43.283,46.434 42.646,45.797 41.863,45.797L20.574,45.797C18.421,41.778 16.134,37.558 13.963,33.618L47.9,33.618C48.686,33.618 49.32,32.981 49.32,32.2C49.32,31.415 48.685,30.778 47.9,30.778L12.388,30.778C10.09,26.651 8,23.008 6.438,20.49C5.849,19.539 5.576,19.007 5.46,18.705C6.37,18.43 8.818,18.33 10.153,18.268L76.907,18.268C78.297,18.329 80.752,18.43 81.664,18.705C81.546,19.006 81.273,19.538 80.686,20.49C73.942,31.369 57.355,63.142 56.698,64.398ZM79.778,46.489C74.891,48.618 69.956,50.194 66.997,51.058C71.167,43.233 76.225,33.882 80.058,27.201C82.31,26.573 88.882,25.517 92.277,28.096C93.854,29.296 94.621,31.142 94.621,33.747C94.62,37.797 89.351,42.326 79.778,46.489Z" />
      </g>
    </SvgIcon>
  );
}

export default V60Icon2;
