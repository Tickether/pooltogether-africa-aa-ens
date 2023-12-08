import { Pooler, useGetPooler } from '@/hooks/useGetPooler'
import styles from './Profile.module.css'
import { Countries } from '@/utils/constants/countries'
import { useState } from 'react'
import { normalize } from 'viem/ens'
import { ZeroDevWeb3Auth } from '@zerodev/web3auth';

interface ProfileProps {
    pooler: Pooler | null
    address: string
    setOpenProfiletModal: (openDepositModal : boolean) => void
    onProfileClose: () => void
}
interface SusuProfile {
    firstname: string
    lastname: string
    phone: string
    susuTag: string
    country: string
}

export default function Profile({pooler, address, setOpenProfiletModal, onProfileClose} : ProfileProps) {
    const { getBackPooler } = useGetPooler('api/getPooler', address)
    const countries = Object.keys(Countries);
    const susuProfileDefaults = {
        firstname: '',
        lastname: '',
        phone: '',
        susuTag: '',
        country: '',
    };
    const [susuProfile, setSusuProfile] = useState<SusuProfile>(susuProfileDefaults)
    const [errorMsg, setErrorMsg] = useState<string>('')
    

    // Handle form input changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        try {
            // Apply number-only logic for the phone input
            const numericValue = name === 'phone' ? value.replace(/\D/g, '') : value;
            // Apply normalize logic for the ens input
            const normalizedValue = name === 'susuTag' && (value.length >= 1) ? normalize(value) : value;
            setSusuProfile((prevData) => ({
                ...prevData,
                [name]: name === 'susuTag' ? normalizedValue : numericValue,
            }));
        } catch (error : any) {
            console.log(error.message);
            setErrorMsg(error.message);
            setTimeout(() => {
                setErrorMsg(''); // Clear error state after 3 seconds
            }, 3666);
        }
        
    }

    //submit profile
    //get email frrom magic - wallet from bico
    const getEmail = async () => {
        const zeroDevWeb3Auth = ZeroDevWeb3Auth.getInstance(['<project-id>']);
        const userInfo =  await zeroDevWeb3Auth.getUserInfo()
        const email = userInfo?.email
        return email!
    }//send pooler scprit
    const postPooler = async (address: string, email: string, first: string, last: string, phone: string, ens: string, country: string) => {
        try {
            const res = await fetch('api/postPooler', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                    email,
                    first, 
                    last, 
                    phone, 
                    ens, 
                    country, 
                })
            }) 
            const data =  await res.json()
        console.log(data)
        } catch (error) {
            console.log(error)
        }
    }// new new profile get email, wallet and formdata
    const handleNewPooler = async(e: any) =>{
        //e.preventDefault()
        const email = await getEmail()
        await postPooler( address!, email, susuProfile.firstname, susuProfile.lastname, susuProfile.phone, susuProfile.susuTag, susuProfile.country )
        getBackPooler()
    }

    //update
    return(
        <>
            <main className={styles.main}>
                <div className={styles.wrapper}>
                    <div 
                        className={styles.close}
                        onClick={() => {
                            setOpenProfiletModal(false)
                            onProfileClose()
                        }} 
                    >
                        close
                    </div>
                    {
                        pooler 
                        ? (
                            <div>
                                
                            </div>
                        )
                        : (
                            <div>
                                <form action="">
                                    <label htmlFor="firstname">First Name</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        placeholder='Vitalik'
                                        value={susuProfile.firstname}
                                        onChange={handleChange}
                                    />

                                    <label htmlFor="lastname">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder='Buterin'
                                        value={susuProfile.lastname}
                                        onChange={handleChange}
                                    />

                                    <label htmlFor="phone">Phone #</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        placeholder='0506661777'
                                        value={susuProfile.phone}
                                        onChange={handleChange}
                                    />
                                    
                                    <label htmlFor="ens">SusuTag</label>
                                    <input
                                        type="text"
                                        id="ens"
                                        name="susuTag"
                                        placeholder='vitalik'
                                        value={susuProfile.susuTag}
                                        onChange={handleChange}
                                    />
                                    {
                                        errorMsg.length >=1 && (
                                            <div className={styles.errorMsgParent}>
                                            <div className={styles.errorMsg}>
                                                <p>{errorMsg}</p>
                                            </div>
                                            </div>
                                        )
                                    }
                                    
                                    <label htmlFor="country">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={susuProfile.country}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select a country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                            {country}
                                            </option>
                                        ))}
                                    </select>
                                </form>
                            </div>
                        )
                    }
                    <div className={styles.buttons}>
                        <button onClick={handleNewPooler}>Save Susu Profile</button>
                    </div>
                </div>
            </main>
        </>
    )
}