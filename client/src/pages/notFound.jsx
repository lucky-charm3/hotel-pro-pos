export default function NotFound()
{
    return(
        <div className='h-screen text-primary-dark flex flex-col space-y-6 justify-center items-center'>
           <h1 className='font-extrabold text-4xl tracking-wider'>
                404 Not found!
                </h1>

<p className='text-xl font-semibold'>Dear beautiful user,it seems you’ve wandered into a 
        corner of the POS universe that doesn’t exist.</p>
<p className='text-xl font-semibold'>Don’t worry, even the best explorers get lost sometimes.</p>
<p className='text-xl font-semibold max-w-5xl'>Our dashboards are fabulous, but this page clearly 
 isn’t invited to the party.Why not turn around and let us guide you back to the magic?
Click below, and let’s get you back on track because lost is boring, but you’re not.</p>
        </div>
    )
}