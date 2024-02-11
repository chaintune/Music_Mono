"""This module features the ImplicitRecommender class that performs
recommendation using the implicit library.
"""


from pathlib import Path
from typing import Tuple, List

import implicit
import scipy
import pandas as pd
from data import load_user_artists, ArtistRetriever


class ImplicitRecommender:
    """The ImplicitRecommender class computes recommendations for a given user
    using the implicit library.

    Attributes:
        - artist_retriever: an ArtistRetriever instance
        - implicit_model: an implicit model
    """

    def __init__(
        self,
        artist_retriever: ArtistRetriever,
        implicit_model: implicit.recommender_base.RecommenderBase,
    ):
        self.artist_retriever = artist_retriever
        self.implicit_model = implicit_model

    def fit(self, user_artists_matrix: scipy.sparse.csr_matrix) -> None:
        """Fit the model to the user artists matrix."""
        self.implicit_model.fit(user_artists_matrix)

    def recommend(
        self,
        user_id: int,
        user_artists_matrix: scipy.sparse.csr_matrix,
        n: int = 10,
    ) -> Tuple[List[str], List[float]]:
        """Return the top n recommendations for the given user."""
        artist_ids, scores = self.implicit_model.recommend(
            user_id, user_artists_matrix[n], N=n
        )
        artists = [
            self.artist_retriever.get_artist_name_from_id(artist_id)
            for artist_id in artist_ids
        ]
        return artists, scores


if __name__ == "__main__":

    # load user artists matrix
    user_artists = load_user_artists(Path("../lastfmdata/user_artists.dat"))

    # instantiate artist retriever
    artist_retriever = ArtistRetriever()
    artist_retriever.load_artists(Path("../lastfmdata/artists.dat"))

    # instantiate ALS using implicit
    implict_model = implicit.als.AlternatingLeastSquares(
        factors=50, iterations=10, regularization=0.01
    )

    # instantiate recommender, fit, and recommend
    recommender = ImplicitRecommender(artist_retriever, implict_model)
    recommender.fit(user_artists)

    dict = { 'user_list' : [], 'artist1_list' : [], 'artist2_list' : [],
             'artist3_list' : [], 'artist4_list' : [], 'artist5_list' : []}
    for user in range(2,17):
        dict['user_list'].append(user)
        artists, scores = recommender.recommend(user, user_artists, n=5)
        # print results
        count=0
        for artist, score in zip(artists, scores):
            count+=1
            if(count==1):
                dict['artist1_list'].append(artist)
            elif(count == 2):
                dict['artist2_list'].append(artist)
            elif(count==3):
                dict['artist3_list'].append(artist)
            elif(count == 4):
                dict['artist4_list'].append(artist)
            elif(count == 5):
                dict['artist5_list'].append(artist)

    df=pd.DataFrame(dict)
    print(df)
    df.to_csv("/Users/shreyanshsrivastava/Desktop/Exported_file.csv")
