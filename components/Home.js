import { useEffect, useState } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie.js';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [movieList, setMovieList] = useState([])
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    fetch('https://my-moviz-backend-two.vercel.app/movies')
    .then(response => response.json())
    .then(data => {
      setMovieList(data.movies)
    });
  }, []);


  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list
  const movies = movieList.map((data) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    const image = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
    if (data.overview.length > 255 ) { data.overview = data.overview.substring(0, 252) + '...' }
    return <Movie key={data.id} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={image} voteAverage={data.vote_average} voteCount={data.vote_count} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;