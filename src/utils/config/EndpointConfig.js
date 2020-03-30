class EndpointConfig {
  constructor() {
    this.endpoint = '/new-endpoint'
    this.method = 'GET'
    this.output_encoding = 'JSON'
    this.extra_config = {}
    this.backends = []
  }
}

export default EndpointConfig
