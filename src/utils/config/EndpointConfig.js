class EndpointConfig {
  constructor() {
    this.endpoint = '/new-endpoint'
    this.method = 'GET'
    this.output = 'JSON'
    this.extra_config = {}
    this.backends = []
  }

  setEL(el, cont) {
    this[el] = cont
  }

  addBackend(backend) {
    this.backend.push(backend)
  }
}

export default EndpointConfig
