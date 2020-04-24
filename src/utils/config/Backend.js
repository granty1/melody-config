class Backend {
  constructor() {
    this.url_pattern = '/new-point'
    this.method = 'GET'
    this.extra_config = {
      melody_ratelimit_proxy: {},
      melody_http: {},
    }
    this.host = []
    this.encoding = 'json'
    this.blacklist = []
    this.whitelist = []
    this.mapping = {}
    this.is_collection = false
    this.disable_host_sanitize = false
  }
}

export default Backend
