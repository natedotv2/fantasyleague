import prisma from "@lib/prisma";
import { useEffect, useState } from 'react';
import { Grid } from '@components/ui';
import { Fixture, Teams, League, Players } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/react'
import  Link  from "next/link";


const UserAccount = ({ owner, leagues }: InferGetServerSidePropsType<typeof getServerSideProps>) => { 
  const [usernewname, setUser] = useState("");
  
  const onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setUser(e.target.value);


  }

  const onUserNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {   
    e.preventDefault();
  
     
    const  userName = usernewname
     const email = owner.email
    const task = "save username"
    const name = owner.name
    
    try {
      await fetch(`/api/user/${name}`, {
        method: "POST",
        body: JSON.stringify({ 
          userName,
          email,
          task
         })
      }).then((res) => {
        res.text().then((data) => {
          console.log(data);
        })
      })
   
 }catch (error) {
      console.log(error);
    }
  }
  



  return (
    <Grid>
      <div className={s.container}>
        <h1 className={s.title}>Account</h1>
        <h2 className={s.subtitle}>Welcome {owner.name}</h2>
        <h2 className={s.subtitle}>Your email is {owner.email}</h2>
        <h2 className={s.subtitle}>{
          owner.userName ? `username:  ${owner.userName}` : `username: You don't have a username yet`

        
      }</h2>
        <img src={owner.image} alt={owner.name} />
        <p>locale: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>



      </div>
      {/* create editable input fields with default values as the current user data */}
      <div className={s.container}>
      

          
      {owner.userName? null:(<form method="POST" onSubmit={onUserNameSubmit}> <label htmlFor="userName">enteruseRname<input type="text" name="userName" onChange={onUserNameChange} /><input type="submit" value="Submit"/></label></form>)}
        
        
        
      </div>
      
 <div  ><h1 className={s.title} style={{textAlign:"center"}}>Leagues</h1></div>
      {
        
        leagues?.map((league: League) => { 
          return (
            <div key={league.id} className={s.container}>
              <h1 className={s.title}>League: {league.name}</h1>
              <h2 className={s.subtitle}>League ID: {league.id}</h2>
              <h2 className={s.subtitle}>League Owner: {league.owner}</h2>
              <h2 className={s.subtitle}>League Region: {league.region}</h2>
              <h2 className={s.subtitle}>League buyinFee: {league.buyInFee}</h2>
              <h2 className={s.subtitle}> <a href={`/leagues/${league.name}`} target="_blank" >LinktoLeague</a></h2>
               
              <h2 className={s.subtitle}></h2></div>)
        })
      }
      
    </Grid>
  )
}





export const getServerSideProps: GetServerSideProps = async (context) => { 

  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  const username  = session?.user?.name as string
  const owner = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
      
    }
  }).then((data) => {
    return data
  })
 
  const leagues = await prisma.league.findMany({
    where: {
      members: {
        some: {
          username: username
        }
      }

    }
  })
  return {
    props: {
      owner, leagues
    }
  }
 
 }
  









export default UserAccount