import { LinkButton } from "@/components/Button"
import { BriefcaseIcon, ArrowDownIcon } from "@/components/Icons"
import { Time } from "@/components/Time"

type LabelledDate = Date & { label?: string }
type ResumeEntry = {
  company: string
  title: string
  logo: string
  start: LabelledDate
  end: LabelledDate
}

function presentDay(): LabelledDate {
  const date: LabelledDate = new Date(Date.now())
  date.label = "Present"
  return date
}

function monthToNumber(month: string): number {
  switch (month) {
    case "Jan":
      return 1
    case "Feb":
      return 2
    case "Mar":
      return 3
    case "Apr":
      return 4
    case "May":
      return 5
    case "Jun":
      return 6
    case "Jul":
      return 7
    case "Aug":
      return 8
    case "Sep":
      return 9
    case "Oct":
      return 10
    case "Nov":
      return 11
    case "Dec":
      return 12
    default:
      throw new Error("Invalid date")
  }
}

function toDate(month: string, year: number) {
  return new Date(`${monthToNumber(month)}/01/${year}`)
}

const resume: ResumeEntry[] = [
  {
    company: "DataCamp",
    title: "Software Engineer",
    logo: "/images/resume/datacamp-logo.jpg",
    start: toDate("Mar", 2019),
    end: presentDay(),
  },
  {
    company: "Moo",
    title: "Software Engineer",
    logo: "/images/resume/moo-logo.jpg",
    start: toDate("Jan", 2017),
    end: toDate("Dec", 2018),
  },
  {
    company: "Marks and Spencer",
    title: "Software Engineer",
    logo: "/images/resume/marks-and-spencer-logo.jpg",
    start: toDate("Nov", 2015),
    end: toDate("Dec", 2016),
  },
  {
    company: "SD Worx",
    title: "Software Engineer",
    logo: "/images/resume/sdworx-logo.jpg",
    start: toDate("May", 2015),
    end: toDate("Oct", 2015),
  },
  {
    company: "tec nv",
    title: "Analist Developer",
    logo: "/images/resume/tec-logo.jpg",
    start: toDate("Nov", 2012),
    end: toDate("Apr", 2015),
  },
]

export function Resume() {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <img src={role.logo} alt="" className="h-7 w-7 rounded-full" />
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                aria-label={`${
                  role.start.label != undefined
                    ? role.start.label
                    : role.start.getFullYear()
                } until ${
                  role.end.label != undefined
                    ? role.end.label
                    : role.end.getFullYear()
                }`}
              >
                <Time
                  dateTime={role.start}
                  format="short"
                  label={role.start.label}
                />{" "}
                <span aria-hidden="true">—</span>{" "}
                <Time
                  dateTime={role.end}
                  format="short"
                  label={role.end.label}
                />
              </dd>
            </dl>
          </li>
        ))}
      </ol>
      <LinkButton href="#" variant="secondary" className="group mt-6 w-full">
        Download CV
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </LinkButton>
    </div>
  )
}
