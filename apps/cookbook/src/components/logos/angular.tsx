export function Angular({ width = 32 }: { width?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 223 236"
      width={width}
    >
      <g clipPath="url(#a)">
        <path
          fill="url(#b)"
          d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
        ></path>
        <path
          fill="url(#c)"
          d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="b"
          x1="49.009"
          x2="225.829"
          y1="213.75"
          y2="129.722"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E40035"></stop>
          <stop offset=".24" stopColor="#F60A48"></stop>
          <stop offset=".352" stopColor="#F20755"></stop>
          <stop offset=".494" stopColor="#DC087D"></stop>
          <stop offset=".745" stopColor="#9717E7"></stop>
          <stop offset="1" stopColor="#6C00F5"></stop>
        </linearGradient>
        <linearGradient
          id="c"
          x1="41.025"
          x2="156.741"
          y1="28.344"
          y2="160.344"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF31D9"></stop>
          <stop offset="1" stopColor="#FF5BE1" stopOpacity="0"></stop>
        </linearGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h223v236H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
