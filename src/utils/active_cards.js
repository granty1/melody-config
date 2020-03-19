import store from '@/store'

export function modifyActiveCards(name) {
  store.commit('modifyActiveCards', name)
}

export function addActiveCards(name) {
  store.commit('addActiveCards', name)
}
