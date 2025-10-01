import { baseTemplate } from './baseTemplate';

export const welcomeEmail = (data: { name: string }) => {
	return baseTemplate(
		`<h2>Hi ${data.name},</h2>

    <p>
      Welcome to <strong>Ride</strong>! your smart, reliable, and affordable way to get around.
    </p>

    <p>
      You’re now part of a growing community that moves with ease and confidence using Ride.
    </p>

    <p>
      <strong>Why Ride?</strong><br/>
      🚖 Fast bookings, transparent pricing, and a safe travel experience every time.
    </p>

    <h3>🌍 Here’s what you can look forward to:</h3>
    <ul>
      <li>Book rides instantly with <strong>one tap</strong></li>
      <li>Track your driver with <strong>real-time GPS updates</strong></li>
      <li>Enjoy <strong>affordable fares</strong> and multiple payment options</li>
      <li>Travel with confidence thanks to <strong>24/7 support and verified drivers</strong></li>
    </ul>

    <p>
      Whether you’re commuting to work, heading to the airport, or just exploring the city, Ride makes every journey simple, safe, and seamless.
    </p>

    <p>
      Quick. Reliable. Secure. That’s getting around the <strong>Ride way</strong>.
    </p>

    <hr style="margin: 24px 0;" />

    <h3>🔒 Your safety comes first:</h3>
    <ul>
      <li>All drivers are <strong>verified and background-checked</strong></li>
      <li><strong>Real-time trip sharing</strong> with family and friends</li>
      <li><strong>24/7 in-app emergency support</strong> for peace of mind</li>
    </ul>

    <p>Want to know more?</p>
    <p>
      <a href="https://www.ride.com/safety" style="color: #1D4ED8; font-weight: bold;">Check out our safety features →</a>
    </p>

    <hr style="margin: 24px 0;" />

    <p>
      We’re excited to take you places.<br />
      <strong>Let’s make every journey better, together.</strong><br />
      – The Ride Inc Team
    </p>`
	);
};
