export default function SvgIcon({
  name,
  prefix = "icon",
  color = "#333",
  width = 40,
  height = 40,
  ...props
}: any) {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg {...props} aria-hidden="true" width={width} height={height}>
      <use href={symbolId} fill={color} />
    </svg>
  );
}
