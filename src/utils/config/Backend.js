class Backend {
  constructor() {
    this.url_pattern = '/new-point'
    this.method = 'GET'
    this.extra_config = {}
    this.host = []
  }

  set(el, cont) {
    this[el] = cont
  }

  addHost(host) {
    this.host.push(host)
  }
}

export default Backend
