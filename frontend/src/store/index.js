import rootReducer from './reducers'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

export function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtention ? window.devToolsExtension() : _ => _
    )
  )

  return store
}


const store = configureStore()


// store.subscribe(value => {
//   console.log("Store Value")
//   console.log(value)
// })


export default store;
