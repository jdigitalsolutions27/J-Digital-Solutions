import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { toCSVCell } from "@/lib/utils";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "Date",
    "Type",
    "Name",
    "Email",
    "Mobile",
    "Business",
    "Website/Facebook",
    "Industry",
    "Package",
    "Budget",
    "Preferred Contact",
    "Preferred Contact Details",
    "Status",
    "Message"
  ];

  const lines = [
    header.join(","),
    ...leads.map((lead) =>
      [
        toCSVCell(lead.createdAt.toISOString()),
        toCSVCell(lead.leadType),
        toCSVCell(lead.fullName),
        toCSVCell(lead.email),
        toCSVCell(lead.mobileNumber),
        toCSVCell(lead.businessName),
        toCSVCell(lead.websiteOrFacebookLink),
        toCSVCell(lead.industry),
        toCSVCell(lead.packageInterest),
        toCSVCell(lead.budgetRange),
        toCSVCell(lead.preferredContactMethod),
        toCSVCell(lead.preferredContactValue),
        toCSVCell(lead.status),
        toCSVCell(lead.messageGoals)
      ].join(",")
    )
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=jdigital-leads-${new Date().toISOString().split("T")[0]}.csv`
    }
  });
}
