import React from "react";
import TeamMember from "@/components/TeamMember";

const team = [
	{
		name: "Ashwin Rao",
		role: "Co-founder & CEO",
		imageUrl: "https://avatars.githubusercontent.com/u/ashwinrao.png",
		linkedinUrl: "https://linkedin.com/in/ashwinrao",
		scholarUrl: "https://scholar.google.com/citations?user=ashwinrao",
		twitterUrl: "https://twitter.com/ashwinrao",
		githubUrl: "https://github.com/ashwinrao",
		bio: (
			<>Ashwin is a security researcher and entrepreneur passionate about building safe AI systems. Previously at Microsoft Research and Google AI.</>
		),
		achievements: [
			{ icon: "award", text: "Best Paper Award, IEEE S&P" },
			{ icon: "education", text: "PhD, Computer Science" }
		],
		featuredAchievement: {
			title: "AI Security Pioneer",
			description: "Ashwin's work on LLM security has influenced industry best practices.",
			imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80"
		}
	},
	{
		name: "Earlence Fernandes",
		role: "Co-founder & CTO",
		imageUrl: "https://avatars.githubusercontent.com/u/earlence.png",
		linkedinUrl: "https://linkedin.com/in/earlence",
		scholarUrl: "https://scholar.google.com/citations?user=earlence",
		twitterUrl: "https://twitter.com/earlence",
		githubUrl: "https://github.com/earlence",
		bio: (
			<>Earlence is a professor and security expert, leading research in AI and systems security. Formerly at University of Wisconsin–Madison.</>
		),
		achievements: [
			{ icon: "award", text: "NSF CAREER Award" },
			{ icon: "work", text: "10+ years in security research" }
		],
		featuredAchievement: {
			title: "Academic Leader",
			description: "Earlence's research has shaped the field of agent security.",
			imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"
		},
		imageOnRight: true
	}
];

const Team = () => (
	<div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 py-20 px-4 font-sans text-slate-100">
		<div className="max-w-4xl mx-auto">
			<h1 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">Meet the Team</h1>
			{team.map((member, idx) => (
				<TeamMember key={member.name} {...member} />
			))}
		</div>
	</div>
);

export default Team;
