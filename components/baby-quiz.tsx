"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizOption } from "@/components/quiz-option";
import { QuizProgress } from "@/components/quiz-progress";
import { QuizQuestion } from "@/components/quiz-question";

type GenderValue = "boy" | "girl" | "gender-neutral" | "prefer-not-to-say";
type ReligionValue = "hinduism" | "islam" | "christianity" | "judaism" | "sikhism" | "buddhism" | "jainism" | "other" | "none";
type QuizStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type MiddleNamePreference = boolean | "unsure" | null;

type BabyQuizState = {
  gender: GenderValue | null;
  nationality: string[];
  nationalityPreference: "none" | null;
  customNationality: string;
  religion: ReligionValue | null;
  customReligion: string;
  religiousPreferences: Record<string, unknown>;
  fatherLastName: string;
  motherLastName: string;
  motherFirstName: string;
  fatherFirstName: string;
  firstNameStartingLetter: string | null;
  middleNameStartingLetter: string | null;
  wantsMiddleName: MiddleNamePreference;
  styles: string[];
  stylePreference: "open" | "selected";
  desiredMeaning: string;
  desiredMeanings: string[];
  customMeaning: string;
  additionalPreferences: string;
};

const initialBabyProfile: BabyQuizState = {
  gender: null,
  nationality: [],
  nationalityPreference: null,
  customNationality: "",
  religion: null,
  customReligion: "",
  religiousPreferences: {},
  fatherLastName: "",
  motherLastName: "",
  motherFirstName: "",
  fatherFirstName: "",
  firstNameStartingLetter: null,
  middleNameStartingLetter: null,
  wantsMiddleName: null,
  styles: [],
  stylePreference: "selected",
  desiredMeaning: "",
  desiredMeanings: [],
  customMeaning: "",
  additionalPreferences: "",
};

const genderOptions = [
  { id: "boy", label: "Boy", icon: "👦" },
  { id: "girl", label: "Girl", icon: "👧" },
  { id: "gender-neutral", label: "Gender-neutral", icon: "✨" },
  { id: "prefer-not-to-say", label: "Prefer not to say", icon: "🤍" },
] as const;

const nationalityOptions = [
  { value: "Indian", label: "Indian", flag: "🇮🇳" },
  { value: "American", label: "American", flag: "🇺🇸" },
  { value: "Mexican", label: "Mexican", flag: "🇲🇽" },
  { value: "Chinese", label: "Chinese", flag: "🇨🇳" },
  { value: "Japanese", label: "Japanese", flag: "🇯🇵" },
  { value: "Korean", label: "Korean", flag: "🇰🇷" },
  { value: "Filipino", label: "Filipino", flag: "🇵🇭" },
  { value: "Italian", label: "Italian", flag: "🇮🇹" },
  { value: "Spanish", label: "Spanish", flag: "🇪🇸" },
  { value: "French", label: "French", flag: "🇫🇷" },
  { value: "German", label: "German", flag: "🇩🇪" },
  { value: "Greek", label: "Greek", flag: "🇬🇷" },
  { value: "Irish", label: "Irish", flag: "🇮🇪" },
  { value: "British", label: "British", flag: "🇬🇧" },
  { value: "Brazilian", label: "Brazilian", flag: "🇧🇷" },
  { value: "Canadian", label: "Canadian", flag: "🇨🇦" },
  { value: "Australian", label: "Australian", flag: "🇦🇺" },
  { value: "Nigerian", label: "Nigerian", flag: "🇳🇬" },
  { value: "Ethiopian", label: "Ethiopian", flag: "🇪🇹" },
  { value: "Egyptian", label: "Egyptian", flag: "🇪🇬" },
  { value: "South African", label: "South African", flag: "🇿🇦" },
  { value: "Other", label: "Other", flag: "✨" },
] as const;

const religionOptions = [
  { id: "hinduism", label: "Hinduism", icon: "🕉️" },
  { id: "islam", label: "Islam", icon: "☪️" },
  { id: "christianity", label: "Christianity", icon: "✝️" },
  { id: "judaism", label: "Judaism", icon: "✡️" },
  { id: "sikhism", label: "Sikhism", icon: "☬" },
  { id: "buddhism", label: "Buddhism", icon: "☸️" },
  { id: "jainism", label: "Jainism", icon: "🪷" },
  { id: "other", label: "Other", icon: "✨" },
  { id: "none", label: "No religious preference", icon: "🤍" },
] as const;

const hinduTraditions = [
  "Krishna",
  "Shiva",
  "Vishnu",
  "Ganesha",
  "Rama",
  "Hanuman",
  "Lakshmi",
  "Saraswati",
  "Durga",
  "Parvati",
  "Other",
  "No specific preference",
] as const;

const islamicTraditions = ["Sunni", "Shia", "Other", "No preference"] as const;
const christianTraditions = ["Catholic", "Protestant", "Orthodox", "Other", "No preference"] as const;
const christianInspiration = ["Biblical names", "Saints", "Biblical meanings", "Christian naming traditions", "Other", "No specific preference"] as const;
const jewishTraditions = ["Hebrew names", "Biblical names", "Traditional Jewish names", "Names based on meaning", "Family naming traditions", "Other", "No specific preference"] as const;
const sikhTraditions = ["Traditional Sikh names", "Names based on meaning", "Names inspired by Sikh tradition", "Other", "No specific preference"] as const;
const buddhistTraditions = ["Buddhist-inspired names", "Names based on meaning", "Traditional names", "Other", "No specific preference"] as const;
const jainTraditions = ["Traditional Jain names", "Names based on meaning", "Jain-inspired names", "Other", "No specific preference"] as const;
const influenceStrengthOptions = ["Strong", "Moderate", "Subtle"] as const;
const firstNameStartingLetters = ["Any", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
const styleOptions = [
  ["modern", "✨", "Modern"],
  ["traditional", "🏛️", "Traditional"],
  ["elegant", "💎", "Elegant"],
  ["unique", "🌟", "Unique"],
  ["strong", "💪", "Strong"],
  ["soft", "🌿", "Soft"],
  ["international", "🌎", "International"],
  ["cultural", "🪷", "Cultural"],
  ["meaningful", "❤️", "Meaningful"],
] as const;
const meaningOptions = [
  ["love", "❤️", "Love"],
  ["strength", "💪", "Strength"],
  ["wisdom", "🧠", "Wisdom"],
  ["peace", "🕊️", "Peace"],
  ["success", "⭐", "Success"],
  ["nature", "🌿", "Nature"],
  ["faith", "🙏", "Faith"],
  ["family", "👨‍👩‍👧", "Family"],
  ["new-beginnings", "🌅", "New beginnings"],
  ["courage", "🦁", "Courage"],
] as const;

export function BabyQuiz() {
  const router = useRouter();
  const [babyProfile, setBabyProfile] = useState<BabyQuizState>(initialBabyProfile);
  const [currentStep, setCurrentStep] = useState<QuizStep>(1);
  const [searchValue, setSearchValue] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isFamilyHelpOpen, setIsFamilyHelpOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const totalSteps = 8;

  const selectedGender = babyProfile.gender;
  const selectedNationalities = babyProfile.nationality;
  const selectedReligion = babyProfile.religion;
  const isNoPreference = babyProfile.nationalityPreference === "none";
  const hasOtherSelection = selectedNationalities.includes("Other");
  const hasCustomReligion = selectedReligion === "other";

  const currentQuestion = useMemo(() => {
    if (currentStep === 1) {
      return {
        title: "What’s the baby’s gender?",
        description: "This helps us find names that fit your preferences.",
      };
    }

    if (currentStep === 2) {
      return {
        title: "Which nationality or naming traditions should we consider?",
        description: "Choose one or more backgrounds you&apos;d like UnameIt to consider when finding names.",
      };
    }

    if (currentStep === 3) {
      return {
        title: "Is there a religious tradition you would like us to consider?",
        description: "This helps UnameIt find names and naming traditions that align with your preferences.",
      };
    }

    if (currentStep === 5) {
      return {
        title: "Let's make sure the name fits your family.",
        description: "We'll use your family name to help find first and middle names that sound natural together.",
      };
    }

    if (currentStep === 6) {
      return {
        title: "Do you have a preferred starting letter for the first name?",
        description: "Choose a letter if you have one in mind, or let UnameIt choose for you.",
      };
    }

    if (currentStep === 7) {
      return {
        title: "Would you like the baby to have a middle name?",
        description: "If you'd like one, we can help find a middle name that works well with the first name and family name.",
      };
    }

    if (currentStep === 8) {
      return {
        title: "Tell us what kind of name you're looking for.",
        description: "Choose the styles and meanings you like. Add anything else you'd like UnameIt to consider.",
      };
    }

    if (selectedReligion === "none") {
      return {
        title: "Next question",
        description: "No religious preference was selected, so the quiz continues to the next question.",
      };
    }

    if (selectedReligion === "hinduism") {
      return {
        title: "Would you like the name to be inspired by a particular deity or Hindu tradition?",
        description: "Choose an influence if you'd like us to incorporate it into the name.",
      };
    }

    if (selectedReligion === "islam") {
      return {
        title: "Which Islamic tradition should we consider?",
        description: "Choose an Islamic naming tradition or no preference.",
      };
    }

    if (selectedReligion === "christianity") {
      return {
        title: "Which Christian tradition should we consider?",
        description: "Choose a Christian tradition or naming preference.",
      };
    }

    if (selectedReligion === "judaism") {
      return {
        title: "Are there any Jewish naming traditions you'd like UnameIt to consider?",
        description: "Choose a preference that feels helpful without making assumptions.",
      };
    }

    if (selectedReligion === "sikhism") {
      return {
        title: "Are there any Sikh naming traditions you'd like UnameIt to consider?",
        description: "Choose a Sikh naming influence or no specific preference.",
      };
    }

    if (selectedReligion === "buddhism") {
      return {
        title: "Are there any Buddhist naming traditions or influences you'd like UnameIt to consider?",
        description: "Choose a Buddhist-inspired direction or leave it open.",
      };
    }

    if (selectedReligion === "jainism") {
      return {
        title: "Are there any Jain naming traditions you'd like UnameIt to consider?",
        description: "Choose a Jain naming influence or leave it open.",
      };
    }

    return {
      title: "Religion-specific preferences",
      description: "Choose the preferences you would like UnameIt to consider.",
    };
  }, [currentStep, selectedReligion]);

  const filteredNationalities = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return nationalityOptions;
    }

    return nationalityOptions.filter(({ label }) => label.toLowerCase().includes(query));
  }, [searchValue]);

  function handleSelectGender(value: GenderValue) {
    setBabyProfile((previous) => ({ ...previous, gender: value }));
  }

  function handleNationalityToggle(value: string) {
    if (isNoPreference && value !== "No preference") {
      return;
    }

    setBabyProfile((previous) => {
      const isSelected = previous.nationality.includes(value);
      const nextNationality = isSelected
        ? previous.nationality.filter((item) => item !== value)
        : [...previous.nationality, value];

      return {
        ...previous,
        nationality: nextNationality,
        nationalityPreference: nextNationality.length === 0 && previous.customNationality.trim() === "" ? null : previous.nationalityPreference,
        customNationality: previous.customNationality,
      };
    });
  }

  function handleNoPreferenceToggle() {
    setBabyProfile((previous) => {
      const currentlySelected = previous.nationalityPreference === "none";

      if (currentlySelected) {
        return {
          ...previous,
          nationality: previous.nationality,
          nationalityPreference: null,
        };
      }

      return {
        ...previous,
        nationality: [],
        nationalityPreference: "none",
        customNationality: "",
      };
    });
  }

  function handleReligionSelect(value: ReligionValue) {
    setBabyProfile((previous) => ({
      ...previous,
      religion: value,
      customReligion: value === "other" ? previous.customReligion : "",
      religiousPreferences: {},
    }));
  }

  function updateReligionPreference(key: string, value: string) {
    setBabyProfile((previous) => ({
      ...previous,
      religiousPreferences: {
        ...previous.religiousPreferences,
        [key]: value,
      },
    }));
  }

  function handleFirstNameStartingLetterSelect(value: string) {
    setBabyProfile((previous) => ({
      ...previous,
      firstNameStartingLetter: value === "Any" ? null : value,
    }));
  }

  function handleMiddleNamePreferenceSelect(value: MiddleNamePreference) {
    setBabyProfile((previous) => ({
      ...previous,
      wantsMiddleName: value,
      middleNameStartingLetter: null,
    }));
  }

  function handleMiddleNameStartingLetterSelect(value: string) {
    setBabyProfile((previous) => ({
      ...previous,
      middleNameStartingLetter: value === "Any" ? null : value,
    }));
  }

  function handleStyleSelect(value: string) {
    setBabyProfile((previous) => {
      const nextStyles = previous.styles.includes(value)
        ? previous.styles.filter((style) => style !== value)
        : [...previous.styles, value];

      return {
        ...previous,
        styles: nextStyles,
        stylePreference: "selected",
      };
    });
  }

  function handleOpenStyleSelect() {
    setBabyProfile((previous) => ({
      ...previous,
      styles: [],
      stylePreference: "open",
    }));
  }

  function handleMeaningSelect(value: string) {
    setBabyProfile((previous) => ({
      ...previous,
      desiredMeanings: previous.desiredMeanings.includes(value)
        ? previous.desiredMeanings.filter((meaning) => meaning !== value)
        : [...previous.desiredMeanings, value],
    }));
  }

  function handleContinue() {
    if (currentStep === 1) {
      if (!selectedGender) return;
      setCurrentStep(2);
      setStatusMessage("");
      return;
    }

    if (currentStep === 2) {
      if (!selectedNationalities.length && !isNoPreference) return;
      setCurrentStep(3);
      setStatusMessage("");
      return;
    }

    if (currentStep === 3) {
      if (!selectedReligion) return;
      setCurrentStep(selectedReligion === "none" ? 5 : 4);
      setStatusMessage("");
      return;
    }

    if (currentStep === 4) {
      if (!isReligionDone) return;
      setCurrentStep(5);
      setStatusMessage("");
      return;
    }

    if (currentStep === 5) {
      const trimmedLastName = babyProfile.fatherLastName.trim();
      if (!trimmedLastName) {
        setBabyProfile((previous) => ({ ...previous, fatherLastName: "" }));
        setStatusMessage("Please enter the family last name to continue.");
        return;
      }

      setBabyProfile((previous) => ({
        ...previous,
        fatherLastName: trimmedLastName,
        motherLastName: previous.motherLastName.trim(),
        motherFirstName: previous.motherFirstName.trim(),
        fatherFirstName: previous.fatherFirstName.trim(),
      }));
      setCurrentStep(6);
      setStatusMessage("");
      return;
    }

    if (currentStep === 6) {
      setCurrentStep(7);
      setStatusMessage("");
      return;
    }

    if (currentStep === 7) {
      setCurrentStep(8);
      setStatusMessage("");
      return;
    }

    if (currentStep === 8) {
      setShowReview(true);
      setStatusMessage("");
    }
  }

  const canContinueStepOne = Boolean(selectedGender);
  const canContinueStepTwo = selectedNationalities.length > 0 || isNoPreference;
  const canContinueStepThree = Boolean(selectedReligion);
  const canContinueStepFive = babyProfile.fatherLastName.trim().length > 0;

  const religionSpecificPreferences = babyProfile.religiousPreferences as Record<string, string | null>;
  const selectedHinduTradition = religionSpecificPreferences.tradition ?? "";
  const selectedHinduStrength = religionSpecificPreferences.influenceStrength ?? "";
  const selectedIslamicTradition = religionSpecificPreferences.islamicTradition ?? "";
  const selectedChristianTradition = religionSpecificPreferences.christianTradition ?? "";
  const selectedChristianInspiration = religionSpecificPreferences.inspiration ?? "";
  const selectedJewishTradition = religionSpecificPreferences.jewishTradition ?? "";
  const selectedSikhTradition = religionSpecificPreferences.sikhTradition ?? "";
  const selectedBuddhistTradition = religionSpecificPreferences.buddhistTradition ?? "";
  const selectedJainTradition = religionSpecificPreferences.jainTradition ?? "";
  const isReligionDone = (() => {
    if (selectedReligion === "none") return true;
    if (selectedReligion === "hinduism") return selectedHinduTradition.length > 0 || selectedHinduTradition === "No specific preference" || selectedHinduTradition === "Other";
    if (selectedReligion === "islam") return Boolean(selectedIslamicTradition);
    if (selectedReligion === "christianity") return Boolean(selectedChristianTradition);
    if (selectedReligion === "judaism") return Boolean(selectedJewishTradition);
    if (selectedReligion === "sikhism") return Boolean(selectedSikhTradition);
    if (selectedReligion === "buddhism") return Boolean(selectedBuddhistTradition);
    if (selectedReligion === "jainism") return Boolean(selectedJainTradition);
    if (selectedReligion === "other") return true;
    return false;
  })();

  const genderLabelMap: Record<string, string> = {
    boy: "Boy",
    girl: "Girl",
    "gender-neutral": "Gender-neutral",
    "prefer-not-to-say": "Prefer not to say",
  };

  const religionLabelMap: Record<string, string> = {
    hinduism: "Hinduism",
    islam: "Islam",
    christianity: "Christianity",
    judaism: "Judaism",
    sikhism: "Sikhism",
    buddhism: "Buddhism",
    jainism: "Jainism",
    other: "Other",
    none: "No religious preference",
  };

  const styleLabelMap: Record<string, string> = Object.fromEntries(styleOptions.map(([value, , label]) => [value, label]));
  const meaningLabelMap: Record<string, string> = Object.fromEntries(meaningOptions.map(([value, , label]) => [value, label]));

  const getReligionPreferenceSummary = () => {
    if (!selectedReligion || selectedReligion === "none") {
      return null;
    }

    const tradition = babyProfile.religiousPreferences.tradition;
    const influenceStrength = babyProfile.religiousPreferences.influenceStrength;
    const islamicTradition = babyProfile.religiousPreferences.islamicTradition;
    const christianTradition = babyProfile.religiousPreferences.christianTradition;
    const inspiration = babyProfile.religiousPreferences.inspiration;
    const jewishTradition = babyProfile.religiousPreferences.jewishTradition;
    const sikhTradition = babyProfile.religiousPreferences.sikhTradition;
    const buddhistTradition = babyProfile.religiousPreferences.buddhistTradition;
    const jainTradition = babyProfile.religiousPreferences.jainTradition;

    if (selectedReligion === "hinduism") {
      if (!tradition || tradition === "No specific preference") {
        return null;
      }

      return [
        `Deity / tradition: ${tradition}`,
        influenceStrength ? `Influence: ${influenceStrength}` : null,
      ].filter(Boolean) as string[];
    }

    if (selectedReligion === "islam") {
      return [islamicTradition ? `Tradition: ${islamicTradition}` : null].filter(Boolean) as string[];
    }

    if (selectedReligion === "christianity") {
      const values = [
        christianTradition ? `Tradition: ${christianTradition}` : null,
        inspiration ? `Naming inspiration: ${inspiration}` : null,
      ].filter(Boolean) as string[];
      return values.length ? values : null;
    }

    if (selectedReligion === "judaism") {
      return [jewishTradition ? `Tradition: ${jewishTradition}` : null].filter(Boolean) as string[];
    }

    if (selectedReligion === "sikhism") {
      return [sikhTradition ? `Tradition: ${sikhTradition}` : null].filter(Boolean) as string[];
    }

    if (selectedReligion === "buddhism") {
      return [buddhistTradition ? `Tradition: ${buddhistTradition}` : null].filter(Boolean) as string[];
    }

    if (selectedReligion === "jainism") {
      return [jainTradition ? `Tradition: ${jainTradition}` : null].filter(Boolean) as string[];
    }

    return null;
  };

  const selectedStyleLabels = babyProfile.stylePreference === "open"
    ? ["Open to anything"]
    : babyProfile.styles.length > 0
      ? babyProfile.styles.map((style) => styleLabelMap[style] ?? style)
      : ["No specific style"];

  const selectedMeaningLabels = (function getSelectedMeanings() {
    const meaningValues = babyProfile.desiredMeanings
      .filter((meaning) => meaning !== "custom")
      .map((meaning) => meaningLabelMap[meaning] ?? meaning);

    if (babyProfile.customMeaning.trim()) {
      meaningValues.push(babyProfile.customMeaning.trim());
    }

    return meaningValues.length > 0 ? meaningValues : ["No specific meaning"];
  })();

  const handleEditJump = (step: QuizStep) => {
    setShowReview(false);
    setCurrentStep(step);
    setStatusMessage("");
  };

  return (
    <main className="quiz-shell">
      <div className="quiz-card">
        <QuizProgress currentStep={currentStep} totalSteps={totalSteps} title="Baby Naming" />

        {currentStep === 1 ? (
          <QuizQuestion title={currentQuestion.title} description={currentQuestion.description}>
            {genderOptions.map((option) => (
              <QuizOption
                key={option.id}
                icon={option.icon}
                label={option.label}
                selected={selectedGender === option.id}
                onSelect={() => handleSelectGender(option.id)}
              />
            ))}
          </QuizQuestion>
        ) : null}

        {currentStep === 2 ? (
          <div className="quiz-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <div className="nationality-search-wrap">
              <input
                type="search"
                className="nationality-search"
                placeholder="Search nationalities or naming traditions..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                aria-label="Search nationalities or naming traditions"
              />
            </div>

            <div className="nationality-option-list">
              <button
                type="button"
                className={`nationality-pill ${isNoPreference ? "nationality-pill-selected" : ""}`}
                aria-pressed={isNoPreference}
                onClick={handleNoPreferenceToggle}
              >
                <span className="nationality-pill-text">No preference</span>
                <span className="nationality-pill-check" aria-hidden="true">{isNoPreference ? "✓" : ""}</span>
              </button>

              {filteredNationalities.length > 0 ? (
                filteredNationalities.map(({ value, label, flag }) => {
                  const selected = selectedNationalities.includes(value);
                  const disabled = isNoPreference;

                  return (
                    <button
                      key={value}
                      type="button"
                      className={`nationality-pill ${selected ? "nationality-pill-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => handleNationalityToggle(value)}
                      disabled={disabled}
                    >
                      <span className="nationality-pill-text">
                        <span aria-hidden="true">{flag}</span> {label}
                      </span>
                      <span className="nationality-pill-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })
              ) : (
                <div className="nationality-empty">No matching traditions found.</div>
              )}
            </div>

            {hasOtherSelection ? (
              <label className="custom-nationality-field">
                <span>Tell us what naming tradition you&apos;d like us to consider.</span>
                <input
                  type="text"
                  value={babyProfile.customNationality}
                  onChange={(event) =>
                    setBabyProfile((previous) => ({
                      ...previous,
                      customNationality: event.target.value,
                    }))
                  }
                  placeholder="Type another naming tradition"
                />
              </label>
            ) : null}
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="quiz-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <div className="religion-grid">
              {religionOptions.map((option) => {
                const selected = selectedReligion === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => handleReligionSelect(option.id)}
                  >
                    <span className="religion-card-icon" aria-hidden="true">{option.icon}</span>
                    <span className="religion-card-label">{option.label}</span>
                    <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>

            {hasCustomReligion ? (
              <label className="custom-nationality-field">
                <span>Tell us what religious or spiritual tradition you&apos;d like us to consider.</span>
                <input
                  type="text"
                  value={babyProfile.customReligion}
                  onChange={(event) =>
                    setBabyProfile((previous) => ({
                      ...previous,
                      customReligion: event.target.value,
                    }))
                  }
                  placeholder="Type another tradition"
                />
              </label>
            ) : null}
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="quiz-question-wrap">
            <h2>{selectedReligion === "none" ? "Next question" : currentQuestion.title}</h2>
            <p>{selectedReligion === "none" ? "No religious preference was selected, so the quiz continues to the next relevant question." : currentQuestion.description}</p>

            {selectedReligion === "none" ? (
              <div className="placeholder-panel">
                <p>No religious preference selected, so the next step can continue without any religion-specific branching.</p>
              </div>
            ) : null}

            {selectedReligion === "hinduism" ? (
              <>
                <div className="religion-grid">
                  {hinduTraditions.map((option) => {
                    const selected = selectedHinduTradition === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => {
                          updateReligionPreference("tradition", option);
                          if (option === "No specific preference") {
                            updateReligionPreference("influenceStrength", "");
                          }
                        }}
                      >
                        <span className="religion-card-label">{option}</span>
                        <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedHinduTradition === "Other" ? (
                  <label className="custom-nationality-field">
                    <span>Type your preferred deity or tradition</span>
                    <input
                      type="text"
                      value={String(religionSpecificPreferences.influence ?? "")}
                      onChange={(event) => updateReligionPreference("influence", event.target.value)}
                      placeholder="Type a deity or tradition"
                    />
                  </label>
                ) : null}

                {selectedHinduTradition && selectedHinduTradition !== "No specific preference" ? (
                  <div className="choice-block">
                    <h3>How strongly should this influence the name?</h3>
                    <div className="religion-grid">
                      {influenceStrengthOptions.map((option) => {
                        const selected = selectedHinduStrength === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                            aria-pressed={selected}
                            onClick={() => updateReligionPreference("influenceStrength", option)}
                          >
                            <span className="religion-card-label">{option}</span>
                            <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {selectedReligion === "islam" ? (
              <>
                <div className="religion-grid">
                  {islamicTraditions.map((option) => {
                    const selected = selectedIslamicTradition === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => updateReligionPreference("islamicTradition", option)}
                      >
                        <span className="religion-card-label">{option}</span>
                        <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedIslamicTradition === "Other" ? (
                  <label className="custom-nationality-field">
                    <span>Tell us what tradition or naming preference you would like us to consider.</span>
                    <input
                      type="text"
                      value={String(religionSpecificPreferences.customPreference ?? "")}
                      onChange={(event) => updateReligionPreference("customPreference", event.target.value)}
                      placeholder="Type a custom preference"
                    />
                  </label>
                ) : null}
              </>
            ) : null}

            {selectedReligion === "christianity" ? (
              <>
                <div className="religion-grid">
                  {christianTraditions.map((option) => {
                    const selected = selectedChristianTradition === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => updateReligionPreference("christianTradition", option)}
                      >
                        <span className="religion-card-label">{option}</span>
                        <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedChristianTradition && selectedChristianTradition !== "No preference" ? (
                  <div className="choice-block">
                    <h3>What would you like the name to be inspired by?</h3>
                    <div className="religion-grid">
                      {christianInspiration.map((option) => {
                        const selected = selectedChristianInspiration === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                            aria-pressed={selected}
                            onClick={() => updateReligionPreference("inspiration", option)}
                          >
                            <span className="religion-card-label">{option}</span>
                            <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {selectedReligion === "judaism" ? (
              <div className="religion-grid">
                {jewishTraditions.map((option) => {
                  const selected = selectedJewishTradition === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => updateReligionPreference("jewishTradition", option)}
                    >
                      <span className="religion-card-label">{option}</span>
                      <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {selectedReligion === "sikhism" ? (
              <div className="religion-grid">
                {sikhTraditions.map((option) => {
                  const selected = selectedSikhTradition === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => updateReligionPreference("sikhTradition", option)}
                    >
                      <span className="religion-card-label">{option}</span>
                      <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {selectedReligion === "buddhism" ? (
              <div className="religion-grid">
                {buddhistTraditions.map((option) => {
                  const selected = selectedBuddhistTradition === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => updateReligionPreference("buddhistTradition", option)}
                    >
                      <span className="religion-card-label">{option}</span>
                      <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {selectedReligion === "jainism" ? (
              <div className="religion-grid">
                {jainTraditions.map((option) => {
                  const selected = selectedJainTradition === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`religion-card ${selected ? "religion-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => updateReligionPreference("jainTradition", option)}
                    >
                      <span className="religion-card-label">{option}</span>
                      <span className="religion-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {selectedReligion === "other" ? (
              <label className="custom-nationality-field">
                <span>Tell us about the religious or spiritual naming tradition you would like us to consider.</span>
                <input
                  type="text"
                  value={babyProfile.customReligion}
                  onChange={(event) =>
                    setBabyProfile((previous) => ({
                      ...previous,
                      customReligion: event.target.value,
                    }))
                  }
                  placeholder="Type another tradition"
                />
              </label>
            ) : null}
          </div>
        ) : null}

        {currentStep === 5 ? (
          <div className="quiz-question-wrap family-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <div className="family-primary-field">
              <label htmlFor="father-last-name">What&apos;s the father&apos;s last name?</label>
              <input
                id="father-last-name"
                type="text"
                value={babyProfile.fatherLastName}
                onChange={(event) => {
                  setBabyProfile((previous) => ({ ...previous, fatherLastName: event.target.value }));
                  setStatusMessage("");
                }}
                onBlur={(event) =>
                  setBabyProfile((previous) => ({ ...previous, fatherLastName: event.target.value.trim() }))
                }
                placeholder="Enter last name"
                autoComplete="family-name"
                autoFocus
                aria-describedby="father-last-name-help"
              />
              <span id="father-last-name-help">We&apos;ll use this as the family surname when evaluating name combinations.</span>
            </div>

            <div className="family-optional-grid">
              <label className="family-field" htmlFor="mother-first-name">
                <span>Mother&apos;s first name <em>Optional</em></span>
                <input
                  id="mother-first-name"
                  type="text"
                  value={babyProfile.motherFirstName}
                  onChange={(event) => setBabyProfile((previous) => ({ ...previous, motherFirstName: event.target.value }))}
                  onBlur={(event) => setBabyProfile((previous) => ({ ...previous, motherFirstName: event.target.value.trim() }))}
                  placeholder="Enter mother's first name"
                  autoComplete="given-name"
                />
              </label>

              <label className="family-field" htmlFor="father-first-name">
                <span>Father&apos;s first name <em>Optional</em></span>
                <input
                  id="father-first-name"
                  type="text"
                  value={babyProfile.fatherFirstName}
                  onChange={(event) => setBabyProfile((previous) => ({ ...previous, fatherFirstName: event.target.value }))}
                  onBlur={(event) => setBabyProfile((previous) => ({ ...previous, fatherFirstName: event.target.value.trim() }))}
                  placeholder="Enter father's first name"
                  autoComplete="given-name"
                />
              </label>

              <label className="family-field" htmlFor="mother-last-name">
                <span>Mother&apos;s last name <em>Optional</em></span>
                <input
                  id="mother-last-name"
                  type="text"
                  value={babyProfile.motherLastName}
                  onChange={(event) => setBabyProfile((previous) => ({ ...previous, motherLastName: event.target.value }))}
                  onBlur={(event) => setBabyProfile((previous) => ({ ...previous, motherLastName: event.target.value.trim() }))}
                  placeholder="Enter mother's last name"
                  autoComplete="family-name"
                />
              </label>
            </div>

            <div className="family-help">
              <button type="button" onClick={() => setIsFamilyHelpOpen((previous) => !previous)} aria-expanded={isFamilyHelpOpen}>
                Why do you ask? <span aria-hidden="true">{isFamilyHelpOpen ? "−" : "+"}</span>
              </button>
              {isFamilyHelpOpen ? (
                <p>Parent names are optional. They can help UnameIt understand family naming preferences and provide more personalized suggestions.</p>
              ) : null}
            </div>

            {statusMessage === "Please enter the family last name to continue." ? <p className="quiz-error-message">{statusMessage}</p> : null}
            <p className="family-privacy-note"><strong>Your information is only used to personalize your naming experience.</strong></p>
          </div>
        ) : null}

        {currentStep === 6 ? (
          <div className="quiz-question-wrap letter-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <div className="letter-grid" role="group" aria-label="First name starting letter">
              {firstNameStartingLetters.map((option) => {
                const selected = option === "Any"
                  ? babyProfile.firstNameStartingLetter === null
                  : babyProfile.firstNameStartingLetter === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`letter-card ${selected ? "letter-card-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => handleFirstNameStartingLetterSelect(option)}
                  >
                    {option}
                    <span className="letter-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {currentStep === 7 ? (
          <div className="quiz-question-wrap middle-name-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <div className="middle-name-choice-grid" role="group" aria-label="Middle name preference">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
                { label: "I'm not sure", value: "unsure" },
              ].map((option) => {
                const selected = babyProfile.wantsMiddleName === option.value;

                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`middle-name-choice ${selected ? "middle-name-choice-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => handleMiddleNamePreferenceSelect(option.value as MiddleNamePreference)}
                  >
                    <span className="middle-name-choice-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {babyProfile.wantsMiddleName === true ? (
              <div className="middle-name-letter-section" aria-live="polite">
                <h3>Do you have a preferred starting letter for the middle name?</h3>
                <p>Optional - choose a letter or let UnameIt decide.</p>
                <div className="letter-grid" role="group" aria-label="Middle name starting letter">
                  {firstNameStartingLetters.map((option) => {
                    const selected = option === "Any"
                      ? babyProfile.middleNameStartingLetter === null
                      : babyProfile.middleNameStartingLetter === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`letter-card ${selected ? "letter-card-selected" : ""}`}
                        aria-pressed={selected}
                        onClick={() => handleMiddleNameStartingLetterSelect(option)}
                      >
                        {option}
                        <span className="letter-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {currentStep === 8 && !showReview ? (
          <div className="quiz-question-wrap preferences-question-wrap">
            <h2>{currentQuestion.title}</h2>
            <p>{currentQuestion.description}</p>

            <section className="preference-section" aria-labelledby="style-heading">
              <span className="preference-section-number">01 - NAME STYLE</span>
              <h3 id="style-heading">What kind of names do you like?</h3>
              <p>Choose as many as you like.</p>
              <div className="preference-card-grid">
                {styleOptions.map(([value, icon, label]) => {
                  const selected = babyProfile.styles.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`preference-card ${selected ? "preference-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => handleStyleSelect(value)}
                    >
                      <span aria-hidden="true">{icon}</span> {label}
                      <span className="preference-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={`preference-card preference-card-open ${babyProfile.stylePreference === "open" ? "preference-card-selected" : ""}`}
                  aria-pressed={babyProfile.stylePreference === "open"}
                  onClick={handleOpenStyleSelect}
                >
                  <span aria-hidden="true">✨</span> I&apos;m open to anything
                  <span className="preference-card-check" aria-hidden="true">{babyProfile.stylePreference === "open" ? "✓" : ""}</span>
                </button>
              </div>
              <p className="preference-note">Let UnameIt choose the style based on your other preferences.</p>
            </section>

            <section className="preference-section" aria-labelledby="meaning-heading">
              <span className="preference-section-number">02 - NAME MEANING</span>
              <h3 id="meaning-heading">Is there a meaning you&apos;d love the name to have?</h3>
              <p>Optional - choose one or more meanings that are important to you.</p>
              <div className="preference-card-grid">
                {meaningOptions.map(([value, icon, label]) => {
                  const selected = babyProfile.desiredMeanings.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`preference-card ${selected ? "preference-card-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => handleMeaningSelect(value)}
                    >
                      <span aria-hidden="true">{icon}</span> {label}
                      <span className="preference-card-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={`preference-card ${babyProfile.desiredMeanings.includes("custom") ? "preference-card-selected" : ""}`}
                  aria-pressed={babyProfile.desiredMeanings.includes("custom")}
                  onClick={() => handleMeaningSelect("custom")}
                >
                  Something else
                  <span className="preference-card-check" aria-hidden="true">{babyProfile.desiredMeanings.includes("custom") ? "✓" : ""}</span>
                </button>
              </div>

              {babyProfile.desiredMeanings.includes("custom") ? (
                <label className="custom-preference-field" htmlFor="custom-meaning">
                  <span>What would you like the name to mean?</span>
                  <input
                    id="custom-meaning"
                    type="text"
                    value={babyProfile.customMeaning}
                    onChange={(event) => setBabyProfile((previous) => ({ ...previous, customMeaning: event.target.value }))}
                    placeholder="Type a meaning..."
                  />
                </label>
              ) : null}
            </section>

            <section className="preference-section" aria-labelledby="additional-heading">
              <span className="preference-section-number">03 - ANYTHING ELSE?</span>
              <h3 id="additional-heading">Anything else you&apos;d like UnameIt to consider?</h3>
              <p>Tell us anything else that could help us find the right names.</p>
              <label className="additional-preferences-field" htmlFor="additional-preferences">
                <span className="visually-hidden">Additional preferences</span>
                <textarea
                  id="additional-preferences"
                  maxLength={500}
                  value={babyProfile.additionalPreferences}
                  onChange={(event) => setBabyProfile((previous) => ({ ...previous, additionalPreferences: event.target.value.slice(0, 500) }))}
                  placeholder={'Example: "I want something easy to pronounce in both English and Hindi."'}
                  rows={5}
                />
              </label>
              <p className="character-counter">{babyProfile.additionalPreferences.length} / 500</p>
            </section>
          </div>
        ) : null}

        {showReview ? (
          <div className="quiz-question-wrap review-content">
            <div className="review-header">
              <span className="preference-section-number">REVIEW</span>
              <h2>Review Your Preferences</h2>
              <p>Here&apos;s everything you&apos;ve told UnameIt. Make sure it looks right before we find your names.</p>
            </div>

            <div className="review-sections">
              <div className="review-card">
                <div className="review-card-header">
                  <h3>👶 Baby</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(1)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Gender</p>
                  <p className="review-value">{genderLabelMap[babyProfile.gender ?? ""] || "Not selected"}</p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>🌎 Naming Background</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(2)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Nationality / Naming Traditions</p>
                  <p className="review-value">
                    {babyProfile.nationalityPreference === "none"
                      ? "No preference"
                      : babyProfile.nationality.length > 0
                        ? babyProfile.nationality
                            .map((nationality) => nationality === "Other" ? babyProfile.customNationality.trim() || "Other" : nationality)
                            .filter(Boolean)
                            .join(", ")
                        : babyProfile.customNationality.trim()
                          ? babyProfile.customNationality.trim()
                          : "No preference"}
                  </p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>🕊️ Religious Preferences</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(3)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Religion</p>
                  <p className="review-value">
                    {babyProfile.religion === "none"
                      ? "No religious preference"
                      : babyProfile.religion === "other"
                        ? babyProfile.customReligion.trim() || "Other"
                        : religionLabelMap[babyProfile.religion ?? ""] || "Not selected"}
                  </p>
                  {selectedReligion && selectedReligion !== "none" && selectedReligion !== "other" && getReligionPreferenceSummary()?.length ? (
                    <div className="review-micro-list">
                      {getReligionPreferenceSummary()?.map((line) => <p key={line}>{line}</p>)}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>👨‍👩‍👧 Family</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(5)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Last name</p>
                  <p className="review-value">{babyProfile.fatherLastName || "Not provided"}</p>
                  {babyProfile.fatherFirstName ? <p className="review-detail"><strong>Father&apos;s first name:</strong> {babyProfile.fatherFirstName}</p> : null}
                  {babyProfile.motherFirstName ? <p className="review-detail"><strong>Mother&apos;s first name:</strong> {babyProfile.motherFirstName}</p> : null}
                  {babyProfile.motherLastName ? <p className="review-detail"><strong>Mother&apos;s last name:</strong> {babyProfile.motherLastName}</p> : null}
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>✨ First Name</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(6)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Starting letter</p>
                  <p className="review-value">{babyProfile.firstNameStartingLetter ? babyProfile.firstNameStartingLetter : "Any letter"}</p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>💫 Middle Name</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(7)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Middle name</p>
                  <p className="review-value">
                    {babyProfile.wantsMiddleName === true
                      ? `Yes${babyProfile.middleNameStartingLetter ? ` · ${babyProfile.middleNameStartingLetter}` : " · Any"}`
                      : babyProfile.wantsMiddleName === false
                        ? "No"
                        : babyProfile.wantsMiddleName === "unsure"
                          ? "Not sure"
                          : "Not selected"}
                  </p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>🎨 Name Style</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(8)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Selected styles</p>
                  <p className="review-value">{selectedStyleLabels.join(" · ")}</p>
                </div>
              </div>

              <div className="review-card">
                <div className="review-card-header">
                  <h3>❤️ Meaning</h3>
                  <button type="button" className="review-edit-button" onClick={() => handleEditJump(8)}>Edit</button>
                </div>
                <div className="review-card-body">
                  <p className="review-label">Desired meanings</p>
                  <p className="review-value">{selectedMeaningLabels.join(" · ")}</p>
                </div>
              </div>

              {babyProfile.additionalPreferences.trim() ? (
                <div className="review-card">
                  <div className="review-card-header">
                    <h3>📝 Additional Preferences</h3>
                    <button type="button" className="review-edit-button" onClick={() => handleEditJump(8)}>Edit</button>
                  </div>
                  <div className="review-card-body">
                    <p className="review-value review-long-text">{babyProfile.additionalPreferences.trim()}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {statusMessage ? <p className="quiz-status-message">{statusMessage}</p> : null}

        <div className="quiz-footer">
          <button
            type="button"
            className="quiz-back-button"
            onClick={() => {
              if (showReview) {
                setShowReview(false);
                setCurrentStep(8);
                setStatusMessage("");
                return;
              }

              if (currentStep === 1) {
                router.push("/");
                return;
              }

              if (currentStep === 2) {
                setCurrentStep(1);
                setStatusMessage("");
                return;
              }

              if (currentStep === 3) {
                setCurrentStep(2);
                setStatusMessage("");
                return;
              }

              if (currentStep === 5) {
                setCurrentStep(selectedReligion === "none" ? 3 : 4);
                setStatusMessage("");
                return;
              }

              if (currentStep === 6) {
                setCurrentStep(5);
                setStatusMessage("");
                return;
              }

              if (currentStep === 7) {
                setCurrentStep(6);
                setStatusMessage("");
                return;
              }

              if (currentStep === 8) {
                setCurrentStep(7);
                setStatusMessage("");
                return;
              }

              setCurrentStep(3);
              setStatusMessage("");
            }}
          >
            ← Back
          </button>

          {showReview ? (
            <button
              type="button"
              className="quiz-continue-button quiz-continue-button-active"
              onClick={() => router.push("/generate")}
            >
              Generate My Names <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              className={`quiz-continue-button ${
                (currentStep === 1
                  ? canContinueStepOne
                  : currentStep === 2
                    ? canContinueStepTwo
                    : currentStep === 3
                      ? canContinueStepThree
                      : currentStep === 4
                        ? isReligionDone
                        : currentStep === 5
                          ? canContinueStepFive
                          : true)
                  ? "quiz-continue-button-active"
                  : ""
              }`}
              disabled={
                currentStep === 1
                  ? !canContinueStepOne
                  : currentStep === 2
                    ? !canContinueStepTwo
                    : currentStep === 3
                      ? !canContinueStepThree
                      : currentStep === 4
                        ? !isReligionDone
                        : currentStep === 5
                          ? !canContinueStepFive
                          : currentStep === 6
                            ? false
                            : babyProfile.wantsMiddleName === null
              }
              onClick={handleContinue}
            >
              Continue <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
