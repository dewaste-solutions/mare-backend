import { eq, sql } from "drizzle-orm";
import { db } from "../src/db";
import {
	requirementCategories,
	requirementQuestion,
	requirementSections,
} from "../src/db/schema/application";
import { requirementChoices } from "../src/db/schema/application";
import { roles } from "../src/db/schema/auth";

const franchiseCategory = [
	{
		id: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
		name: "basic information",
		requirementStep: 1,
	},
	{
		id: "585d410b-4c00-476c-902b-a82601f48258",
		name: "location",
		requirementStep: 2,
	},
	{
		id: "c8b647bb-bcc6-407a-8583-52a89f20e018",
		name: "organization structure",
		requirementStep: 3,
	},
	{
		id: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
		name: "community profile",
		requirementStep: 4,
	},
	{
		id: "11bbc41b-6b7a-4f24-9d88-9a3c53c77ae3",
		name: "documents",
		requirementStep: 5,
	},
];

const franchiseSections = [
	{
		id: "dcf60f77-362e-4618-b874-e43eced05515",
		requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
		name: "personal information",
		order: 1,
	},
	{
		id: "1825c51f-e8e9-48b0-8f57-7015385521a1",
		requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
		name: "contact information",
		order: 2,
	},
	{
		id: "afb5bf76-f695-4850-be91-ca20eb642eef",
		requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
		name: "address",
		order: 3,
	},
	{
		id: "f8037ce4-2899-4a88-9d3d-d986aaf977bf",
		requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
		name: "interest in mare!",
		order: 4,
	},
	{
		id: "2a5aeb9d-21d9-4599-9b6d-ce034f783b58",
		requirementCategoryId: "585d410b-4c00-476c-902b-a82601f48258",
		name: "property ownership",
		order: 1,
	},
	{
		id: "57310ec2-f933-4004-a23e-8f9017adc3b3",
		requirementCategoryId: "585d410b-4c00-476c-902b-a82601f48258",
		name: "location details",
		order: 2,
	},
	{
		id: "d2b6e341-be6e-45cb-ad00-9f22a35ff42f",
		requirementCategoryId: "c8b647bb-bcc6-407a-8583-52a89f20e018",
		name: "business structure",
		order: 1,
	},
	{
		id: "4eb146ed-bb21-4f55-8d8b-944529027939",
		requirementCategoryId: "c8b647bb-bcc6-407a-8583-52a89f20e018",
		name: "management",
		order: 2,
	},
	{
		id: "b514d444-697c-4ae7-ab2e-a3da88c58648",
		requirementCategoryId: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
		name: "service area",
		order: 1,
	},
	{
		id: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5",
		requirementCategoryId: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
		name: "business clients",
		order: 2,
	},
	{
		id: "833ab770-07ef-4e80-8dad-4d0d485bdb89",
		requirementCategoryId: "11bbc41b-6b7a-4f24-9d88-9a3c53c77ae3",
		name: "documents",
		order: 1,
	},
];

const franchiseQuestion = [
	{
		id: "e9e99402-2d2b-4bb6-97e7-815e0d17e993",
		requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515",
		question: "first name",
		placeholder: "first name",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1.1",
		allowMultiple: false,
	},
	{
		id: "6f64c45d-27b1-417e-8091-1c04919fbb1b",
		requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515",
		question: "middle name",
		placeholder: "middle name",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1.2",
		allowMultiple: false,
	},
	{
		id: "56451b02-4571-4126-8bc3-dc1a130b2fac",
		requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515",
		question: "last name",
		placeholder: "last name",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1.3",
		allowMultiple: false,
	},
	{
		id: "3768668c-430b-40f7-bbcc-eca82254e284",
		requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515",
		question: "birthday",
		placeholder: "pick a date",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "date" as const,
		order: "2",
		allowMultiple: false,
	},
	{
		id: "f7d82303-3692-46d2-a539-c2e4bec97c89",
		requirementSectionId: "1825c51f-e8e9-48b0-8f57-7015385521a1",
		question: "email address",
		placeholder: "sample@domain.com",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_email" as const,
		order: "1",
		allowMultiple: false,
	},
	{
		id: "281f59c0-1d78-4632-a260-9a083647a1e5",
		requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef",
		question: "address line 1",
		placeholder: "street address, P.O. box, company name",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1",
		allowMultiple: false,
	},
	{
		id: "c36ae71e-9cd5-4b5b-9e43-7b4d4b3a12ad",
		requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef",
		question: "address line 2",
		placeholder: "apartment, suite, unit, building, floor",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "2",
		allowMultiple: false,
	},
	{
		id: "b6a983e5-4282-4342-bdd1-37113adec936",
		requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef",
		question: "province",
		placeholder: "province",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "3.1",
		allowMultiple: false,
	},
	{
		id: "ccbb3d51-5fdb-4e6a-a6a0-f438ce3fbf8d",
		requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef",
		question: "city / municipality",
		placeholder: "city / municipality",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "3.2",
		allowMultiple: false,
	},
	{
		id: "710a403c-c789-4abf-9c98-151c52a17443",
		requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef",
		question: "barangay",
		placeholder: "barangay",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "3.3",
		allowMultiple: false,
	},
	{
		id: "8eab99de-644c-4845-ab67-91d208bf2847",
		requirementSectionId: "f8037ce4-2899-4a88-9d3d-d986aaf977bf",
		question: "interesado ako na magnegosyo ng mare! dahil",
		placeholder: "ibahagi ang iyong dahilan",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1",
		allowMultiple: false,
	},

	{
		id: "7467332f-b636-4808-8312-692036efa4aa",
		requirementSectionId: "2a5aeb9d-21d9-4599-9b6d-ce034f783b58",
		question: "ako ay may lugar para sa mare!",
		placeholder: "",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "radiogroup" as const,
		order: "1",
		allowMultiple: false,
	}, // choices
	{
		id: "55d77192-e97b-40cb-991c-56aede96d8f9",
		requirementSectionId: "57310ec2-f933-4004-a23e-8f9017adc3b3",
		question: "ito ay may sukat na (ibigay ang demonsion in meters)",
		placeholder: "e.g., 5m x 10m",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1",
		allowMultiple: false,
	},
	{
		id: "cb32e717-00fd-465f-bc3b-f88211519e7f",
		requirementSectionId: "57310ec2-f933-4004-a23e-8f9017adc3b3",
		question:
			"ibahagi ang lugar kung saan niyo itatayo ang inyong mare! facility sa pamamagitan ng google maps",
		placeholder: "google map link",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "2",
		allowMultiple: false,
	},

	{
		id: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
		requirementSectionId: "d2b6e341-be6e-45cb-ad00-9f22a35ff42f",
		question: "patatakbuhin ang negosyong ito bilang",
		placeholder: "",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "radiogroup" as const,
		order: "1",
		allowMultiple: false,
	}, // choices
	{
		id: "abcfa9ed-5e23-49f4-822c-51f0ebd56021",
		requirementSectionId: "4eb146ed-bb21-4f55-8d8b-944529027939",
		question: "patatakbuhin ang negosyong ito bilang",
		placeholder: "",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "radiogroup" as const,
		order: "1",
		allowMultiple: false,
	}, // choices
	{
		id: "85fdd4a4-01a6-405f-831d-470823b936a1",
		requirementSectionId: "4eb146ed-bb21-4f55-8d8b-944529027939",
		question: "ibigay ang lahat ng pangalan ng mga tauhan",
		placeholder: "listahan ng mga pangalan...",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "textarea" as const,
		order: "2",
		allowMultiple: false,
	},

	{
		id: "4a010677-805d-4792-9d7b-ddff5d015aa8",
		requirementSectionId: "b514d444-697c-4ae7-ab2e-a3da88c58648",
		question:
			"ilang mga kabahayan ang maseserbisyuhan ng inyong mare! facility",
		placeholder: "e.g., 500",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1",
		allowMultiple: false,
	},
	{
		id: "b65e010e-4fd2-4f08-b4dd-111b40f7c436",
		requirementSectionId: "b514d444-697c-4ae7-ab2e-a3da88c58648",
		question:
			"ibigay ang pangalan ng mga streets, subdibisyon, komunidad, at/o barangay",
		placeholder: "listahan ng mga lugar...",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "textarea" as const,
		order: "2",
		allowMultiple: false,
	},
	{
		id: "74bb360e-e7ad-45f1-b54a-c6e407f39755",
		requirementSectionId: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5",
		question:
			"ilang mga kalapit ng negosyo ang magiging kilyente ng inyong mare! facility",
		placeholder: "e.g., 5m x 10m",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "input_text" as const,
		order: "1",
		allowMultiple: false,
	},
	{
		id: "42b1e22d-99c7-48c2-895a-e71e062a3fdf",
		requirementSectionId: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5",
		question:
			"magbigay ng mga pangalan ng mga negosyong ito at uri ng negosyo nila",
		placeholder: "listahan ng mga negosyo...",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "textarea" as const,
		order: "2",
		allowMultiple: false,
	},

	{
		id: "5199da5f-0757-43de-8c1f-b47c2e389b17",
		requirementSectionId: "833ab770-07ef-4e80-8dad-4d0d485bdb89",
		question: "which documents are you uploading?",
		placeholder: "select document type",
		description: "",
		isRequired: true,
		defaultValue: "",
		component: "select_upload" as const,
		order: "1",
		allowMultiple: false,
	}, // choices
];

const franchiseChoices = [
	{
		name: "sariling pagmamay-ari",
		requirementQuestionId: "7467332f-b636-4808-8312-692036efa4aa",
	},
	{
		name: "nirentahan o rerentahan pa lamang",
		requirementQuestionId: "7467332f-b636-4808-8312-692036efa4aa",
	},
	{
		name: "sa kooperatiba",
		requirementQuestionId: "7467332f-b636-4808-8312-692036efa4aa",
	},
	{
		name: "sa kasosyo sa negosyo",
		requirementQuestionId: "7467332f-b636-4808-8312-692036efa4aa",
	},
	{
		name: "hihiramin sa kakilala",
		requirementQuestionId: "7467332f-b636-4808-8312-692036efa4aa",
	},
	{
		name: "kooperatiba",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "korporasyon",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "sole proprietor",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "one person corporation",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "non profit organization o foundation",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "local government unit",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "homeowner association",
		requirementQuestionId: "ffbb33b2-dcf4-43c2-843f-0d840d82b74f",
	},
	{
		name: "oo, ako mismo ang manager",
		requirementQuestionId: "abcfa9ed-5e23-49f4-822c-51f0ebd56021",
	},
	{
		name: "oo, ako ay isa lamang sa mga managers",
		requirementQuestionId: "abcfa9ed-5e23-49f4-822c-51f0ebd56021",
	},
	{
		name: "hindi, may tao akong kukunin bilang manager",
		requirementQuestionId: "abcfa9ed-5e23-49f4-822c-51f0ebd56021",
	},
	{
		name: "hindi pa ako sigurado",
		requirementQuestionId: "abcfa9ed-5e23-49f4-822c-51f0ebd56021",
	},
	{
		name: "file 1",
		requirementQuestionId: "5199da5f-0757-43de-8c1f-b47c2e389b17",
	},
	{
		name: "file 2",
		requirementQuestionId: "5199da5f-0757-43de-8c1f-b47c2e389b17",
	},
	{
		name: "file 3",
		requirementQuestionId: "5199da5f-0757-43de-8c1f-b47c2e389b17",
	},
];

export async function seedRequirements() {
	// creating question
	await db.transaction(async (tx) => {
		// creating question for franchise
		const franchiseRoleResult = await tx
			.select({ id: roles.id })
			.from(roles)
			.where(eq(roles.name, "franchise"));

		// creating a category for franchise
		const requirementCategoryWithRole = franchiseCategory.map((req) => ({
			...req,
			roleId: franchiseRoleResult[0].id,
			updatedAt: sql`NOW()`,
		}));
		await tx
			.insert(requirementCategories)
			.values(requirementCategoryWithRole)
			.returning({
				id: requirementCategories.id,
				name: requirementCategories.name,
			});

		// creating sections for franchise
		const requirementSectionsWithCategory = franchiseSections.map(
			(section) => ({
				...section,
				updatedAt: sql`NOW()`,
			}),
		);
		await tx
			.insert(requirementSections)
			.values(requirementSectionsWithCategory)
			.returning({
				id: requirementSections.id,
				name: requirementSections.name,
			});

		// creating questions for franchise
		const requirementQuestionWithSection = franchiseQuestion.map(
			(question) => ({
				...question,
				updatedAt: sql`NOW()`,
			}),
		);
		await tx
			.insert(requirementQuestion)
			.values(requirementQuestionWithSection)
			.returning({
				id: requirementQuestion.id,
				question: requirementQuestion.question,
			});

		// creating choices for franchise question
		const requirementChoicesWithQuestion = franchiseChoices.map((choice) => ({
			...choice,
			updatedAt: sql`NOW()`,
		}));

		await tx.insert(requirementChoices).values(requirementChoicesWithQuestion);
	});
}
