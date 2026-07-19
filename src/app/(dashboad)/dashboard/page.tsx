"use client";
import { Button, MultiSelect, SelectElement } from "@/components/atoms";
import { Messages, Section, Div, MatchCard } from "@/components/molecules";
import { useMatches } from "@/store/useMatchesStore";
import { updatePreferences } from "@/lib/profile";
import {
	INDUSTRIES,
	SKILL_CATEGORIES,
	LOCATIONS,
	COMMITMENT_LEVELS,
	FINANCIAL_CONTRIBUTIONS,
	FOUNDER_STATUSES,
	PERSONALITY_TRAITS,
} from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Check, Loader2, X } from "lucide-react";
import { endpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios";
import { RequestSection } from "@/components/pages/dashboard/requestCard";
import { getUserChats } from "@/lib/chats";
import { useUserStore } from "@/store/userStore";

export default function Dashboard() {
	const { matches, setMatches } = useMatches();
	const { user } = useUserStore();
	const router = useRouter();

	const { data: matchedUsers } = useQuery({
		queryKey: ["matched-users"],
		queryFn: async () => {
			const res = await instance.get(endpoints().Matches.get_matches);
			return res.data;
		},
	});

	useEffect(() => {
		if (matchedUsers) {
			setMatches(matchedUsers);
		}
	}, [matchedUsers, setMatches]);

	// Show a handful on the dashboard; the full list lives on /suggestions
	const previewMatches = matches?.slice(0, 6) ?? [];

	useEffect(() => {
		const fetchUserChats = async () => {
			if (!user) return;
			const data = await getUserChats(user?.id);
			console.log(data);
		};
		fetchUserChats();
	}, []);

	const [showPrompt, setShowPrompt] = useState(false);
	const [savingPrefs, setSavingPrefs] = useState(false);
	const [prefSuccess, setPrefSuccess] = useState(false);
	const [prefForm, setPrefForm] = useState({
		preferredIndustry: "",
		preferredSkills: [] as string[],
		preferredLocation: "",
		preferredCommitmentLevel: "",
		preferredFinancial: "",
		preferredFounderType: "",
		preferredPersonalityTraits: [] as string[],
	});

	const updatePrefField = <K extends keyof typeof prefForm>(
		field: K,
		value: (typeof prefForm)[K],
	) => {
		setPrefForm((prev) => ({ ...prev, [field]: value }));
	};

	useEffect(() => {
		const flag = localStorage.getItem("showPreferencesPrompt");
		if (flag === "true") {
			setShowPrompt(true);
		}
	}, []);

	const dismissPrompt = () => {
		localStorage.removeItem("showPreferencesPrompt");
		setShowPrompt(false);
	};

	const handleSavePreferences = async () => {
		setSavingPrefs(true);
		const result = await updatePreferences({
			preferredIndustry: prefForm.preferredIndustry,
			preferredSkills: prefForm.preferredSkills,
			preferredLocation: prefForm.preferredLocation,
			preferredCommitmentLevel: prefForm.preferredCommitmentLevel,
			preferredFinancial: prefForm.preferredFinancial,
			preferredFounderType: prefForm.preferredFounderType,
			preferredPersonalityTraits: prefForm.preferredPersonalityTraits,
		});
		if (result) {
			setPrefSuccess(true);
			setTimeout(() => dismissPrompt(), 1500);
		}
		setSavingPrefs(false);
	};

	const industries = INDUSTRIES.map((v) => ({ value: v, label: v }));
	const skillCategories = SKILL_CATEGORIES.map((v) => ({ value: v, label: v }));
	const locations = LOCATIONS.map((v) => ({ value: v, label: v }));
	const commitmentLevels = COMMITMENT_LEVELS.map((v) => ({
		value: v,
		label: v,
	}));
	const financialContributions = FINANCIAL_CONTRIBUTIONS.map((v) => ({
		value: v,
		label: v,
	}));
	const founderStatuses = FOUNDER_STATUSES.map((v) => ({ value: v, label: v }));
	const personalityTraits = PERSONALITY_TRAITS.map((v) => ({
		value: v,
		label: v,
	}));

	return (
		<section className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 h-[90vh]  max-h-[600px]   md:max-w-full mx-auto">
			{/* One-time preferences form */}
			{showPrompt && (
				<div className="xl:col-span-2 bg-card border border-primary/20 rounded-2xl p-6 space-y-6 shadow-sm">
					{/* Header */}
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3">
							<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
								<Sparkles className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">
									Fine-tune your co-founder match!
								</h3>
								<p className="text-sm text-muted-foreground mt-1 max-w-lg">
									Tell us what you&apos;re looking for in a co-founder to get
									better match suggestions. You can always update these later.
								</p>
							</div>
						</div>
						<button
							onClick={dismissPrompt}
							className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
						>
							<X className="w-4 h-4 text-muted-foreground" />
						</button>
					</div>

					{/* Success message */}
					{prefSuccess && (
						<div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/10">
							<Check className="w-5 h-5 text-primary" />
							<p className="text-sm text-primary font-medium">
								Preferences saved successfully!
							</p>
						</div>
					)}

					{/* Preferences form */}
					{!prefSuccess && (
						<Section title="Co-founder Preferences">
							<Div>
								<SelectElement
									label="What industry would you like your co-founder to be in?"
									items={industries}
									value={prefForm.preferredIndustry}
									onChange={(value) =>
										updatePrefField("preferredIndustry", value)
									}
									placeholder="Select industry"
								/>

								<MultiSelect
									label="What skills do you prefer in a co-founder?"
									items={skillCategories}
									value={prefForm.preferredSkills}
									max={3}
									onChange={(value) =>
										updatePrefField("preferredSkills", value)
									}
									placeholder="Select up to 3 skills"
								/>

								<SelectElement
									label="Where would you like your co-founder to be located?"
									items={locations}
									value={prefForm.preferredLocation}
									onChange={(value) =>
										updatePrefField("preferredLocation", value)
									}
									placeholder="Select location"
								/>

								<SelectElement
									label="What level of commitment do you want from a co-founder?"
									items={commitmentLevels}
									value={prefForm.preferredCommitmentLevel}
									onChange={(value) =>
										updatePrefField("preferredCommitmentLevel", value)
									}
									placeholder="Select commitment level"
								/>

								<SelectElement
									label="Do you expect your co-founder to contribute financially?"
									items={financialContributions}
									value={prefForm.preferredFinancial}
									onChange={(value) =>
										updatePrefField("preferredFinancial", value)
									}
									placeholder="Select financial expectation"
								/>

								<SelectElement
									label="What is your preferred co-founder status?"
									items={founderStatuses}
									value={prefForm.preferredFounderType}
									onChange={(value) =>
										updatePrefField("preferredFounderType", value)
									}
									placeholder="Select founder status"
								/>

								<MultiSelect
									label="What personality traits would you prefer in a co-founder?"
									items={personalityTraits}
									placeholder="Select up to 3"
									max={3}
									value={prefForm.preferredPersonalityTraits}
									onChange={(value) =>
										updatePrefField("preferredPersonalityTraits", value)
									}
								/>
							</Div>
						</Section>
					)}

					{/* Actions */}
					{!prefSuccess && (
						<div className="flex items-center justify-end gap-3 pt-2 border-t">
							<Button variant="outline" onClick={dismissPrompt}>
								Skip for now
							</Button>
							<Button disabled={savingPrefs} onClick={handleSavePreferences}>
								{savingPrefs ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Check className="w-4 h-4 mr-2" />
										Save Preferences
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			)}
			{/* Left column - make it scrollable */}
			<section className="flex flex-col gap-6 h-full overflow-y-auto scrollbar">
				{/* Matches section */}
				{previewMatches.length > 0 ? (
					<section className="bg-card border border-border py-2 rounded-2xl w-full flex flex-col">
						<div className="flex justify-between items-center px-4 py-2 flex-shrink-0">
							<p className="font-semibold text-[1.2em]">Suggestions</p>
							<Button
								variant="outline"
								className="m-0"
								onClick={() => router.replace("/suggestions")}
							>
								See All
							</Button>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-2">
							{previewMatches.map((match, index) => (
								<MatchCard
									key={index}
									name={match.matchedFounderDetails.name}
									profileId={match.matchedProfileId}
									location={match.matchedFounderDetails.location}
									industry={match.matchedFounderDetails.industry}
									tags={match.matchedFounderDetails.skills}
									score={match.overallScore}
									onClick={() =>
										router.push(`/profile/${match.matchedProfileId}`)
									}
								/>
							))}
						</div>
					</section>
				) : (
					<div className="flex justify-center items-center">
						<div className="flex flex-col gap-4">
							<Image
								src="/svg/no-data.svg"
								width={200}
								height={200}
								alt="no data"
							/>
							<p className="text-center">No Match Generated</p>
						</div>
					</div>
				)}

				{/* Co-founder Requests section */}
				<RequestSection />
			</section>

			{/* Right column - Messages */}
			<div className="hidden xl:block">
				<Messages />
			</div>
		</section>
	);
}
