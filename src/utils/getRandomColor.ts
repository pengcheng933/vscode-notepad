export function getRandomColor(maxAttempts: number = 50): string {
  const colorDifference = (color1: number[], color2: number[]): number => {
    // 计算颜色差异，可以使用不同的算法，这里简单地计算每个通道的差值的绝对值之和
    return color1.reduce(
      (diff, value, index) => diff + Math.abs(value - color2[index]),
      0
    );
  };

  const isSimilarToWhite = (color: number[]): boolean => {
    const threshold = 50;
    return color.every((value) => value > 255 - threshold);
  };

  const isSimilarToBlack = (color: number[]): boolean => {
    const threshold = 50;
    return color.every((value) => value < threshold);
  };

  const isLightColor = (color: number[]): boolean => {
    const luminance =
      (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255;
    return luminance > 0.5;
  };

  const getRandomColorValue = (): number => {
    // 引入更大的随机性，使用更大的范围
    return Math.floor(Math.random() * 256);
  };

  let attempts = 0;
  let currentColor: number[] = [
    getRandomColorValue(),
    getRandomColorValue(),
    getRandomColorValue(),
  ];
  let previousColor: number[] = [
    getRandomColorValue(),
    getRandomColorValue(),
    getRandomColorValue(),
  ];

  while (
    (isSimilarToWhite(currentColor) ||
      isSimilarToBlack(currentColor) ||
      isLightColor(currentColor) ||
      colorDifference(currentColor, previousColor) < 100) && // 调整差异的阈值
    attempts < maxAttempts
  ) {
    previousColor = currentColor;
    currentColor = [
      getRandomColorValue(),
      getRandomColorValue(),
      getRandomColorValue(),
    ];
    attempts += 1;
  }

  if (attempts === maxAttempts) {
    return "#5662f6";
  } // 如果达到最大循环次数，返回默认颜色

  const hexColor = currentColor
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
  return `#${hexColor}`;
}
