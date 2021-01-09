import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// const features = [
//   {
//     title: 'HeyMD',
//     imageUrl: 'https://camo.githubusercontent.com/f8c236888077d4fbc25311ad94b2cbf43b9e12cdf5211871d1c6378cdb615c45/68747470733a2f2f692e696d6775722e636f6d2f434565334a63472e706e67',
//     link: 'https://github.com/tsungtingdu/heymd',
//     description: (
//       <>
//         HeyMD is an online markdown note appplication.
//       </>
//     ),
//   }
// ];

// function Feature({ imageUrl, title, link, description }) {
//   const imgUrl = useBaseUrl(imageUrl);
//   return (
//     <div className={clsx('col col--4', styles.feature, 'text--center')}>
//       {imgUrl && (
//         <a
//           className="text--center mb-3 d-block"
//           href={link}
//           target="_blank"
//           rel="noreferrer noopener"
//         >
//           <img className={styles.featureImage} src={imgUrl} alt={title} />
//         </a>
//       )}
//       <h3>{title}</h3>
//       <p className="text--left">{description}</p>
//     </div>
//   );
// }

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('blog/')}>
              visit my blog
            </Link>
          </div>
        </div>
      </header>
      <main className="main-page">
        <div className="empty">test</div>
      </main>
    </Layout>
  );
}

export default Home;
