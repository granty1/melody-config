class Backend {
  constructor() {
    this.url_pattern = '/new-point'
    this.method = 'GET'
    this.extra_config = {}
    this.host = []
    this.encoding = 'json'
    this.blacklist = []
    this.whitelist = []
    this.mapping = {}
    this.is_collection = false
  }
}

export default Backend