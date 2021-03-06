import EntityLifecycle from './common/entity-lifecycle';
import validateOptions from "./util/validateOptions";

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */

export default function loadEntity(
  name,
  promise,
  options
) {
  if (!name || typeof name !== 'string') throw new Error('Missing required entity name');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');
  try {
    !validateOptions(options)
  } catch (error) {
    throw error;
  }
  const entityLifecycle = new EntityLifecycle(name, options);
  return (dispatch, getState) => {
    entityLifecycle.setDispatch(dispatch);
    entityLifecycle.setGetState(getState);
    entityLifecycle.onLoad();
    return new Promise((resolve, reject) => {
        promise
            .then((data) => {
              resolve(entityLifecycle.onSuccess(data));
            })
            .catch((error) => {
              reject(entityLifecycle.onFailure(error));
            });
    })
  };
}
