class EndpointConfig {
  constructor() {
    this.endpoint = '/new-endpoint'
    this.method = 'GET'
    this.output_encoding = 'JSON'
    this.extra_config = {
      melody_ratelimit_router: {},
      melody_proxy: {},
      melody_jose_validator: {},
      melody_jose_signer: {},
      melody_alert: {},
    }
    this.backends = []
  }
}

export default EndpointConfig
