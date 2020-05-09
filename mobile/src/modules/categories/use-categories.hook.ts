import * as React from 'react';
import * as firebase from 'firebase';
import { AuthContext } from '../auth/Auth.context';
import { CategoryObject } from './types';

function useCategories(): CategoryObject {
  const authContext = React.useContext(AuthContext);
  const [categories, setCategories] = React.useState<CategoryObject>({});
  React.useEffect(() => {
    if (authContext.state.user) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('categories')
        .onSnapshot(function(querySnapshot) {
          const _categories: any = {};
          querySnapshot.forEach(function(doc) {
            _categories[doc.id] = doc.data();
          });
          setCategories(_categories);
        });
      return (): void => unsubscribe();
    }
  }, [authContext.state.user]);
  return categories;
}

export default useCategories;
