type Rgb = [number, number, number]

function toRgb(hex: string): Rgb {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
}

// 人眼感知的亮度：先把 sRGB 通道线性化，再按红、绿、蓝的权重求和。
function luminance(rgb: Rgb) {
  const linear = rgb.map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
}

function contrast(background: Rgb, text: '#ffffff' | '#000000') {
  const value = luminance(background)
  return text === '#ffffff' ? 1.05 / (value + 0.05) : (value + 0.05) / 0.05
}

// 不透明底色上叠加黑色遮罩：通道乘以 (1 - 透明度)。
function darken(rgb: Rgb, opacity: number): Rgb {
  return rgb.map((channel) => channel * (1 - opacity)) as Rgb
}

export function getOnPrimaryColor(hex: string) {
  const rgb = toRgb(hex)
  return contrast(rgb, '#ffffff') >= contrast(rgb, '#000000') ? '#ffffff' : '#000000'
}

export function getSidebarPalette(hex: string, dark: boolean) {
  // 暗色模式先压暗主色，随后所有文字计算都基于这个真实底色。
  const background = darken(toRgb(hex), dark ? 0.25 : 0).map(Math.round) as Rgb
  const opacities = [0, 0.1, 0.2, 0.26]
  const worstContrast = (text: '#ffffff' | '#000000', scale: number) =>
    Math.min(...opacities.map((opacity) => contrast(darken(background, opacity * scale), text)))

  // 选择在所有状态下最清晰的同一种文字颜色，避免 hover 时黑白跳变。
  let text: '#ffffff' | '#000000' =
    worstContrast('#ffffff', 1) >= worstContrast('#000000', 1) ? '#ffffff' : '#000000'
  let scale = 1
  if (worstContrast(text, scale) < 4.5) {
    // 某些中间亮度的背景无法承受很深的遮罩：先选择底色上的最佳文字，再减轻遮罩。
    text =
      contrast(background, '#ffffff') >= contrast(background, '#000000') ? '#ffffff' : '#000000'
    while (scale > 0 && worstContrast(text, scale) < 4.5) {
      scale = Math.max(0, Number((scale - 0.01).toFixed(2)))
    }
  }

  const overlay = (opacity: number) => `rgb(0 0 0 / ${(opacity * scale).toFixed(4)})`
  return {
    background: `#${background.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`,
    text,
    hover: overlay(0.1),
    active: overlay(0.2),
    activeHover: overlay(0.26),
  }
}
