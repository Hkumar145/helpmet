import React from 'react'
import Dashboard from './Dashboard'
import Header from '../components/Header'
import '../css/LandingPage.css'


const Home = () => {
  return (
    <div className='mainLand'>
      
      <div className='slogan'>
        <div className="firstb">
          <h1 className='lightsl'>Your Partner in</h1>
          <h1 className='boldsl'>Workplace Safety</h1>
          <p className='data'>Report, analyze, and act on injury data effortlessly with our user-friendly platform, designed to make workplace safety management easier, proactive, and more efficient.</p>
        </div>
        <div className='slimages'>
        <img src="../../images/LandingpageImages/GroupEverything.svg" alt="" style={{height:'100vh'}}/>
        
        {/* <img src="../../images/Clocklan.svg" alt="" />
        <img src="../../images/Heatmaplan.svg" alt="" />
        <img src="../../images/Rectangle 1 lan.svg" alt="" />
        <img src="../../images/Rectangle 1-1 lan.svg" alt="" /> */}
      </div>
      </div>
      <div className="except"><img src="../../images/LandingpageImages/HelloWorld.svg" alt="" /></div>
      <div className='slogansec'>
      <div className="firstb inv">
        <h1 className='lightsl'>One platform</h1>
        <h1 className='boldsl'>Incident Report</h1>
        <p className='data'>Safety reporting has never been easier or more efficient. Our inbuilt incident report form allows you to submit and access critical information directly through your email, ensuring every detail is at your fingertips whenever and wherever you need it.</p>
      </div>
      <div className="slimages landscape lanepor"><img src="../../images/LandingpageImages/incidentReportlan.png" alt="" /></div>
      </div>
      
      <div className='sloganthir'>
      <div className="secondb">
         <h1 className='lightsl'>Track {/*<span className='boldsl'>Safety</span>*/}</h1> 
        <h1 className='boldsl'>Safety equipment check</h1>
      </div>
        <div className="slimages lanepor"><img src="../../images/LandingpageImages/safetyequiplan.svg" alt="" /></div>
      
      </div>
      
      <div className='sloganfour'>
      <div className="thirdb inv">
        <h1 className='lightsl'>Analyze data with AI</h1>
        <h1 className='boldsl'>Injury Analytics</h1>
        <p className='data'>Take a proactive approach to workplace safety with Helpmet’s advanced Injury Analytics Dashboard. This dashboard transforms data into actionable insights, giving you a clear view of trends, high-risk areas, and potential hazards across your organization.</p>
      </div>
      <div className="slimages landscape lanepor"><img src="../../images/LandingpageImages/injuryanalan.svg" alt="" /></div>
      </div>
      
      <div className="sloganfif">
      <h1 className='lightsl'>Analyze</h1>
      <div className="gr1">
        <div className="anal1">
          <img src="../../images/LandingpageImages/Heatmaplan.svg" alt="" />
            <p className='data'>Injury Heat Maps provide a real-time geographical view of incident hotspots, helping you allocate resources effectively.</p>
            </div>
          <div className="anal2">
            <img src="../../images/LandingpageImages/siteinjlan.svg" alt="" className='slofifimg' />
            <p className="data">Status and Severity Indicators to prioritize response based on injury severity and location, ensuring timely action for high-risk incidents.</p>
          </div>
      </div>

      <div className="gr2">
        <div className="anal3">
          <img src="../../images/LandingpageImages/Overviewlan.svg" alt="" className='slofifimg' />
            <p className="data keep">Look into the statistics of your weekly data</p>
        </div>
        <div className="anal4">
          <img src="../../images/LandingpageImages/Safetychelan.svg" alt="" className='slofifimg' />
            <p className="data keep">Ensures compliance by monitoring scheduled checks to avoid missed inspections.</p>
        </div>
        
        <div className="anal5">
          <img src="../../images/LandingpageImages/epiprolan.svg" alt="" className='slofifimg' />
            <p className="data keep">Anticipates risk patterns, enabling preventative measures before escalation.</p>
          </div>
        </div>
      </div>

      <div className="sloganfif six">
      <h1 className='lightsl'>Analyze</h1>
      <h1 className='boldsl'>Deep</h1>

      </div>

      <div className="filt">
        <div className="sam">
          <div className="sloganthir sev">
          <h1 className='lightsl'>Filter with graph</h1>
            <h1 className='boldsl'>Overview</h1>
            <p className='data'>This dashboard provides a quick view of weekly injury trends, category projections, and detailed incident logs with filtering through graph, helping you prioritize safety actions and reduce future risks effectively.</p>
          </div>
          <div className="slimages landscape lanepor sev sevspesh"><img src="../../images/LandingpageImages/graphlan.svg" alt="" /></div>
        </div>

      <div className="sam2">
        <div className="sloganthir sev eig">
        <h1 className='lightsl'>Don’t miss </h1>
          <h1 className='boldsl'>Safety Equipment</h1>
          <p className='data'>This dashboard provides a clear overview of scheduled vs. completed checks, locations, and responsible personnel, ensuring compliance and maintaining a safe work environment effortlessly.</p>
        </div>
        <div className="slimages landscape lanepor sevspesh seveig"><img src="../../images/LandingpageImages/safelan.svg" alt="" /></div>
        </div>
      </div>
      
      <div className="sloganfif six not">
      <h1 className='lightsl'>Notify</h1>
      </div>
      <div className="not-main">
        <div className='slogansec nine'>
        <div className="firstb inv">
          <h1 className='lightsl'>Worn with timing</h1>
          <h1 className='boldsl'>Alerts</h1>
          <p className='data'>Tailor alerts to reach the right people at the right time, enhancing safety and responsiveness across your team.</p>
        </div>
        <div className="slimages landscape lanepor"><img src="../../images/LandingpageImages/notiflan.svg" alt="" /></div>
        </div>
      </div>
      {/* <img src="../../images/Harshdeep kaur.svg" alt="" /> */}
      <section>
        <div className="coverpho"><img src="../../images/team/grp.png" alt="" /></div>
        <h1 className='tops'>OUR TEAM</h1>
        <div className="teams">
          <div className="images1">
            <img src="../../images/team/Roy.jpg" alt="" />
            <div className="fdeets">
              <h1>Roy Yeung</h1>
              <p>PM & Full-Stack Developer</p>
              <div className="socials"><a href="http://www.twitter.com/"><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="http://www.linkedin.com/in/roy-y"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>
          <div className="images">
            <img src="../../images/team/Rooben.jpg" alt="" />
            <div className="otherdeets">
              <h1>Rooben</h1>
              <p>UX Engineer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="https://www.linkedin.com/in/rooben-me"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Kisaja.jpg" alt="" />
            <div className="otherdeets">
              <h1>Kisaja (Riveen)</h1>
              <p>Junior Designer</p>
              <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="http://www.linkedin.com/in/kisaja-riveen"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Harshdeep.jpg" alt="" />
            <div className="otherdeets">
              <h1>Harshdeep Kaur</h1>
              <p>Junior UI/UX Designer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href=""><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Harshdeep.jpg" alt="" />
            <div className="otherdeets">
              <h1>Gurleen Kaur</h1>
              <p>UI/UX Designer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="https://www.linkedin.com/in/gurleen-designer/"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Hemant.jpg" alt="" />
            {/* <img src="../../images/team/Hemant1.jpg" alt="" /> */}
            <div className="otherdeets">
              <h1>Hemant Kumar</h1>
              <p>Lead Full-Stack Developer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="http://www.linkedin.com/in/hemant-e"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Mohit.jpg" alt="" />
            <div className="otherdeets">
              <h1>Mohit Duggar</h1>
              <p>Full-Stack Developer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="http://www.linkedin.com/in/mohit-duggar"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/Promise.jpg" alt="" />
            <div className="otherdeets">
              <h1>Promise</h1>
              <p>Front-End Developer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="https://www.linkedin.com/in/promise-olajide-0ab17718b/"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

          <div className="images">
            <img src="../../images/team/XueHui.jpg" alt="" />
            <div className="otherdeets">
              <h1>Xuehui Lan</h1>
              <p>Full-Stack Developer</p>
                        <div className="socials"><a href=""><img src="../../images/twitWF Badge.svg" alt="" /></a><a href="http://www.linkedin.com/in/xuehui-lan"><img src="../../images/LinkedWF Badge.svg" alt="" /></a></div>
            </div>
            </div>

        </div>

      </section>


    <p className='text-center'>© 2024 PIKA PRODUCTIONS</p>
    </div>
  )
}

export default Home;