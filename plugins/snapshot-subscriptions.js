import firebase from 'firebase'

export default ({ store }) => {
  firebase
    .firestore()
    .collection('listing')
    .onSnapshot(
      snapshot => {
        var listings = []
        snapshot.forEach(listing => {
          listings.push({ ...listing.data(), id: listing.id })
        })
        store.commit('listings/set', {
          listings
        })
      },
      error => {
        //TODO: wrtie to bugsnag

        console.log(error)
      }
    )
}
