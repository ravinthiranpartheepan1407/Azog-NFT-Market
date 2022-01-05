import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return(
    <div>
      <nav>
        <p className="text-center"> Azog NFT Market </p>
          <br />
          <div className="text-center">
            <Link href="/">
              <a> Home </a>
            </Link>
            &nbsp;
            &nbsp;
            <Link  href="/create-item">
              <a> Sell Your NFT </a>
            </Link>
            &nbsp;
            &nbsp;
            <Link href="/own-assets">
              <a> Owned Digital Assests </a>
            </Link>
            &nbsp;
            &nbsp;
            <Link href="/creator-nftdashboard">
              <a> Creator Dashbaord </a>
            </Link>
          </div>
      </nav>
    <Component {...pageProps} />
    </div>
  )
}

export default MyApp
