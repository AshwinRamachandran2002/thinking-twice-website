import { motion } from "framer-motion";
import Navbar from '../components/Navbar';
import { Link } from "react-router-dom";

const blogPosts = [
	{
		title: "Attack on Zendesk Support MCP Server",
		date: "2025-06-04",
		author: "ContextFort Security Team",
		summary: "How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive vulnerability information from Zendesk through carefully crafted prompt injections.",
		image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
		href: "/blog/zendesk-attack"
	},
	{
		title: "Attack on Jira Atlassian MCP Server",
		date: "2025-06-04",
		author: "ContextFort Security Team",
		summary: "How AI agents with tool-calling capabilities can be exploited to exfiltrate sensitive data from Jira through carefully crafted prompt injections.",
		image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
		href: "/blog/jira-attack"
	}
];

const Blog = () => {
	return (
		<div className="relative min-h-screen overflow-hidden font-sans text-slate-700 selection:bg-[#ffa62b]/30 selection:text-slate-900" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
			{/* Muted mango background with subtle gradient */}
			<div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.12),transparent_60%)]" />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(255,166,43,0.08),transparent_50%)]" />

			<Navbar />

			<div className="py-20 px-4 mt-16">
				<div className="max-w-5xl mx-auto">
					<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">Security Research & Insights</motion.h1>
					<div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
						{blogPosts.map((post, idx) => (
							<motion.div
								key={post.title}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 * idx, duration: 0.6, ease: "easeOut" }}
								className="group bg-slate-900/80 rounded-3xl shadow-xl border border-cyan-900/30 overflow-hidden flex flex-col hover:scale-[1.03] hover:shadow-2xl transition-transform"
							>
								<Link to={post.href} className="flex flex-col flex-1">
									<div className="h-48 w-full overflow-hidden">
										<img src={post.image} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
									</div>
									<div className="flex-1 flex flex-col p-6">
										<h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">{post.title}</h2>
										<div className="text-xs text-slate-400 mb-2">{post.date} • {post.author}</div>
										<p className="text-slate-200 mb-4 flex-1">{post.summary}</p>
										<span className="inline-block mt-auto text-cyan-400 font-semibold hover:underline">Read more →</span>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Blog;
