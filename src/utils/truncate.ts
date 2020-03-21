const truncate = (sentence: string, count = 30, end = "..."): string => {
  const words = sentence.split(" ")

  if (words.length > 30) {
    return `${words.splice(0, count).join(" ")} ${end}`
  }
  return sentence
}

export default truncate
