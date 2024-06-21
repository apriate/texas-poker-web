export default {
  // 接口请求域名
  url: import.meta.env.VITE_API_BASE_URL,
  // 静态资源域名
  res: location.href.split('#')[0] + '#'
}
