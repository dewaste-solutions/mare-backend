import { sql, eq } from "drizzle-orm";
import { db } from "../src/db";
import { requirementCategories, requirementSections, requirementQuestion } from "../src/db/schema/application";
import { roles } from "../src/db/schema/auth";

const franchiseCategory = [
    {
        id: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
        name: "basic information",
        requirementStep: 1,
        updatedAt: sql`NOW()`,
    },
    {
        id: "585d410b-4c00-476c-902b-a82601f48258",
        name: "location",
        requirementStep: 2,
        updatedAt: sql`NOW()`,
    },
    {
        id: "c8b647bb-bcc6-407a-8583-52a89f20e018",
        name: "organization structure",
        requirementStep: 3,
        updatedAt: sql`NOW()`,
    },
    {
        id: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
        name: "community profile",
        requirementStep: 4,
        updatedAt: sql`NOW()`,
    },
    {
        id: "11bbc41b-6b7a-4f24-9d88-9a3c53c77ae3",
        name: "documents",
        requirementStep: 5,
        updatedAt: sql`NOW()`,
    }
]

const franchiseSections = [
    {
        id: "dcf60f77-362e-4618-b874-e43eced05515",
        requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
        name: "personal information",
        order: 1,
        updatedAt: sql`NOW()`,
    },
    {
        id: "1825c51f-e8e9-48b0-8f57-7015385521a1",
        requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
        name: "contact information",
        order: 2,
        updatedAt: sql`NOW()`,
    },
    {
        id: "afb5bf76-f695-4850-be91-ca20eb642eef",
        requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
        name: "address",
        order: 3,
        updatedAt: sql`NOW()`,
    },
    {
        id: "f8037ce4-2899-4a88-9d3d-d986aaf977bf",
        requirementCategoryId: "0fdcb0e3-453d-4f4d-8ab1-14048f10f02e",
        name: "interest in mare!",
        order: 4,
        updatedAt: sql`NOW()`,
    },
    {
        id: "2a5aeb9d-21d9-4599-9b6d-ce034f783b58",
        requirementCategoryId: "585d410b-4c00-476c-902b-a82601f48258",
        name: "property ownership",
        order: 1,
        updatedAt: sql`NOW()`,
    },
    {
        id: "57310ec2-f933-4004-a23e-8f9017adc3b3",
        requirementCategoryId: "585d410b-4c00-476c-902b-a82601f48258",
        name: "location details",
        order: 2,
        updatedAt: sql`NOW()`,
    },
    {
        id: "d2b6e341-be6e-45cb-ad00-9f22a35ff42f",
        requirementCategoryId: "c8b647bb-bcc6-407a-8583-52a89f20e018",
        name: "business structure",
        order: 1,
        updatedAt: sql`NOW()`,
    },
    {
        id: "4eb146ed-bb21-4f55-8d8b-944529027939",
        requirementCategoryId: "c8b647bb-bcc6-407a-8583-52a89f20e018",
        name: "management",
        order: 2,
        updatedAt: sql`NOW()`,
    },
    {
        id: "b514d444-697c-4ae7-ab2e-a3da88c58648",
        requirementCategoryId: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
        name: "service area",
        order: 1,
        updatedAt: sql`NOW()`,
    },
    {
        id: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5",
        requirementCategoryId: "f2cb04b0-de69-4b43-b11a-f9030d9e0b0d",
        name: "business clients",
        order: 2,
        updatedAt: sql`NOW()`,
    },
    {
        id: "833ab770-07ef-4e80-8dad-4d0d485bdb89",
        requirementCategoryId: "11bbc41b-6b7a-4f24-9d88-9a3c53c77ae3",
        name: "documents",
        order: 1,
        updatedAt: sql`NOW()`,
    }
]

const franchiseQuestion = [
    {requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515", question: "first name", placeholder: "first name", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false,},
    {requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515", question: "middle name", placeholder: "middle name", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false,},
    {requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515", question: "last name", placeholder: "last name", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false,},
    {requirementSectionId: "dcf60f77-362e-4618-b874-e43eced05515", question: "birthday", placeholder: "pick a date", description: "", isRequired: true, defaultValue: "", component: "date" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "1825c51f-e8e9-48b0-8f57-7015385521a1", question: "email address", placeholder: "sample@domain.com", description: "", isRequired: true, defaultValue: "", component: "input_email" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef", question: "address line 1", placeholder: "street address, P.O. box, company name", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef", question: "address line 2", placeholder: "apartment, suite, unit, building, floor", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef", question: "province", placeholder: "province", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef", question: "city / municipality", placeholder: "city / municipality", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "afb5bf76-f695-4850-be91-ca20eb642eef", question: "barangay", placeholder: "barangay", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },
    {requirementSectionId: "f8037ce4-2899-4a88-9d3d-d986aaf977bf", question: "interesado ako na magnegosyo ng mare! dahil", placeholder: "ibahagi ang iyong dahilan", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 1, allowMultiple: false, },

    {requirementSectionId: "2a5aeb9d-21d9-4599-9b6d-ce034f783b58", question: "ako ay may lugar para sa mare!", placeholder: "", description: "", isRequired: true, defaultValue: "", component: "radiogroup" as const, order: 2, allowMultiple: false,}, // choices
    {requirementSectionId: "57310ec2-f933-4004-a23e-8f9017adc3b3", question: "ito ay may sukat na (ibigay ang demonsion in meters)", placeholder: "e.g., 5m x 10m", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 2, allowMultiple: false, },
    {requirementSectionId: "57310ec2-f933-4004-a23e-8f9017adc3b3", question: "ibahagi ang lugar kung saan niyo itatayo ang inyong mare! facility sa pamamagitan ng google maps", placeholder: "google map link", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 2, allowMultiple: false, },

    {requirementSectionId: "d2b6e341-be6e-45cb-ad00-9f22a35ff42f", question: "patatakbuhin ang negosyong ito bilang", placeholder: "", description: "", isRequired: true, defaultValue: "", component: "radiogroup" as const, order: 3, allowMultiple: false,}, // choices
    { requirementSectionId: "4eb146ed-bb21-4f55-8d8b-944529027939", question: "patatakbuhin ang negosyong ito bilang", placeholder: "", description: "", isRequired: true, defaultValue: "", component: "radiogroup" as const, order: 3, allowMultiple: false, }, // choices
    { requirementSectionId: "4eb146ed-bb21-4f55-8d8b-944529027939", question: "ibigay ang lahat ng pangalan ng mga tauhan", placeholder: "listahan ng mga pangalan...", description: "", isRequired: true, defaultValue: "", component: "textarea" as const, order: 3, allowMultiple: false, },

    {requirementSectionId: "b514d444-697c-4ae7-ab2e-a3da88c58648", question: "ilang mga kabahayan ang maseserbisyuhan ng inyong mare! facility", placeholder: "e.g., 500", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 4, allowMultiple: false,},
    {requirementSectionId: "b514d444-697c-4ae7-ab2e-a3da88c58648", question: "ibigay ang pangalan ng mga streets, subdibisyon, komunidad, at/o barangay", placeholder: "listahan ng mga lugar...", description: "", isRequired: true, defaultValue: "", component: "textarea" as const, order: 4, allowMultiple: false, },
    {requirementSectionId: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5", question: "ilang mga kalapit ng negosyo ang magiging kilyente ng inyong mare! facility", placeholder: "e.g., 5m x 10m", description: "", isRequired: true, defaultValue: "", component: "input_text" as const, order: 4, allowMultiple: false, },
    {requirementSectionId: "89fa6e80-bc50-439f-ad9e-7c164a8f9cc5", question: "magbigay ng mga pangalan ng mga negosyong ito at uri ng negosyo nila", placeholder: "listahan ng mga negosyo...", description: "", isRequired: true, defaultValue: "", component: "textarea" as const, order: 4, allowMultiple: false, },

    {requirementSectionId: "833ab770-07ef-4e80-8dad-4d0d485bdb89", question: "which documents are you uploading?", placeholder: "select document type", description: "", isRequired: true, defaultValue: "", component: "select_upload" as const, order: 5, allowMultiple: false,}, // choices
];

export async function seedRequirements() {
    // creating question
    await db.transaction(async (tx) => {
        // creating question for franchise 
        const franchiseRoleResult = await tx.select({id: roles.id}).from(roles).where(eq(roles.name, 'franchise'))

         // creating a category for franchise
        const requirementCategoryWithRole = franchiseCategory.map((req) => ({
            ...req,
            roleId: franchiseRoleResult[0].id,
            updatedAt: sql`NOW()`,
        }));
        await tx.insert(requirementCategories).values(requirementCategoryWithRole).returning({id: requirementCategories.id, name: requirementCategories.name})
    
        // creating sections for franchise
        const requirementSectionsWithCategory = franchiseSections.map((section) => ({
            ...section,
            updatedAt: sql`NOW()`,
        }));
        await tx.insert(requirementSections).values(requirementSectionsWithCategory).returning({id: requirementSections.id, name: requirementSections.name})
        
        // creating questions for franchise
        const requirementQuestionWithSection = franchiseQuestion.map((question) => ({
            ...question,
            updatedAt: sql`NOW()`,
        }));
        await tx.insert(requirementQuestion).values(requirementQuestionWithSection).returning({id: requirementQuestion.id, question: requirementQuestion.question})
    });

    // getting question
    await db.transaction(async (tx) => {
        const franchiseRoleResult = await tx.select({id: roles.id}).from(roles).where(eq(roles.name, 'franchise'))
		// biome-ignore lint/suspicious/noConsole: <explanation>
		// biome-ignore lint/nursery/noSecrets: <explanation>
	    console.log("franchiseRoleResult", franchiseRoleResult)

        // Get categories with their sections and questions
        const categoriesWithSectionsAndQuestions = await tx
            .select({
                category: {
                    id: requirementCategories.id,
                    name: requirementCategories.name,
                    requirementStep: requirementCategories.requirementStep
                },
                section: {
                    id: requirementSections.id,
                    name: requirementSections.name,
                    order: requirementSections.order
                },
                question: {
                    id: requirementQuestion.id,
                    question: requirementQuestion.question,
                    description: requirementQuestion.description,
                    isRequired: requirementQuestion.isRequired,
                    placeholder: requirementQuestion.placeholder,
                    defaultValue: requirementQuestion.defaultValue,
                    component: requirementQuestion.component,
                    order: requirementQuestion.order,
                    allowMultiple: requirementQuestion.allowMultiple
                }
            })
            .from(requirementCategories)
            .where(eq(requirementCategories.roleId, franchiseRoleResult[0].id))
            .leftJoin(requirementSections, eq(requirementSections.requirementCategoryId, requirementCategories.id))
            .leftJoin(requirementQuestion, eq(requirementQuestion.requirementSectionId, requirementSections.id))
            .orderBy(requirementCategories.requirementStep, requirementSections.order, requirementQuestion.order);
        
        // console.log(categoriesWithSectionsAndQuestions)
		
        // Transform the flat structure into nested format
        const nestedStructure = categoriesWithSectionsAndQuestions.reduce((acc, row) => {
            // Find or create category
            let category = acc.find(c => c.categoryName === row.category.name);
            if (!category) {
                category = {
                    categoryName: row.category.name,
                    requirementStep: row.category.requirementStep,
                    sections: []
                };
                acc.push(category);
            }

            // Find or create section
            if (row.section?.id) {
                let section = category.sections.find(s => s.sectionName === row.section?.name);
                if (!section) {
                    section = {
                        sectionName: row.section.name,
                        sectionOrder: row.section.order,
                        questions: []
                    };
                    category.sections.push(section);
                }

                // Add question if it exists
                if (row.question?.id) {
                    section.questions.push({
                        question: row.question.question,
                        description: row.question.description,
                        isRequired: row.question.isRequired,
                        placeholder: row.question.placeholder,
                        defaultValue: row.question.defaultValue,
                        component: row.question.component,
                        order: row.question.order,
                        allowMultiple: row.question.allowMultiple
                    });
                }
            }

            return acc;
        }, [] as Array<{
            categoryName: string;
            requirementStep: number;
            sections: Array<{
                sectionName: string;
                sectionOrder: number;
                questions: Array<{
                    question: string;
                    description: string;
                    isRequired: boolean;
                    placeholder: string;
                    defaultValue: string;
                    component: string;
                    order: number | null;
                    allowMultiple: boolean;
                }>;
            }>;
        }>);

        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.dir(nestedStructure, { depth: null });

    })

    // submit application


    // display answers
}
