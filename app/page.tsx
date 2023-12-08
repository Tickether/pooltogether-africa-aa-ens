import Image from 'next/image'
import styles from './page.module.css'
import Login from '@/component/login/login'

export default function Home() {

  return (
    <>
      <div className={styles.background}>
        <Image
          src='BG3.svg'
          alt='Background'
          layout='fill'
          objectFit='cover'
        />
      </div>
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1>Welcome to the Susu Pool</h1>
        </div>
        <div className={styles.action}>
          <p>Join millions of Africans saving at least a dollar a day & winning prizes daily!!!</p>
        </div>
        <div className={styles.workings}>
          <div className={styles.working}>
            <Image
              src='deposit.svg'
              alt='Deposit Local for Dollars'
              width={250}
              height={250}
            />
            <h4>Save in Dollars</h4>
            <p>Deposit Local for a chance to win</p>
          </div>
          <div className={styles.working}>
            <Image
              src='winPrizes.svg'
              alt='Win Prizes'
              width={250}
              height={250}
            />
            <h4>Win Prizes</h4>
            <p>Yield from deposits fund prizes</p>
          </div>
          <div className={styles.working}>
            <Image
              src='noLoss.svg'
              alt='No Losses'
              width={250}
              height={250}
            />
            <h4>No Loss</h4>
            <p>Withdraw any time</p>
          </div>
        </div>
        
        <div className={styles.login}>
          
          <Login />
        </div>
      </main>
    </>
  )
}
