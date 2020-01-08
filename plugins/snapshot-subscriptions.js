import firebase from 'firebase'

export default ({ store }) => {
  firebase
    .firestore()
    .collection('listings')
    .where('active', '==', true)
    .onSnapshot(
      snapshot => {
        var listings = []
        snapshot.forEach(listing => {
          listings.push({ ...listing.data(), id: listing.id })
        })
        //TODO: comit to store here
      },
      error => {
        //TODO: wrtie to bugsnag
        console.log(error)
      }
    )
}
