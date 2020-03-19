import store from '@/store'

export function modifyActiveCards(name) {
  store.commit('modifyActiveCards', name)
}
