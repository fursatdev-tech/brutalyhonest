import CalendarLanding from "@/components/calendar/CalendarLanding";
import Container from "@/components/ui/container";
import { getHostCalendar } from "@/lib/actions/hostCalendar";

const Calendar = async () => {
  const calendar = await getHostCalendar();

  return (
    <Container>
      <CalendarLanding calendar={calendar} />
    </Container>
  );
};

export default Calendar;
