export default {
  storageOptions: {
    namespace: 'melody_', // prefix
    name: 'ls', // use Vue.ls or $ls
    storage: 'local',
  },

  defaultActiveCards: [
    'service-Service Name',
    'service-HTTP Server settings',
    'service-Available hosts',
    'logging-Logging',
    'logging-Gelf',
    'logging-Metrics',
    'logging-InfluxDB',
    'safe-Security headers',
  ],
}
