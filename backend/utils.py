from datetime import datetime, timedelta

def get_n_nearest_workdays(reference_date=None, n=1):
    if n <= 0:
        raise ValueError("n phải là số nguyên dương")
    if reference_date is None:
        reference_date = datetime.now()

    reference_date = reference_date.replace(hour=0, minute=0, second=0, microsecond=0)
    workdays = []
    current_date = reference_date
    count = 1
    while len(workdays) < n and count <= 30:
        if current_date.weekday() < 5:
            workdays.append(current_date.strftime('%d/%m/%Y'))
        current_date = current_date - timedelta(days=1)
        count += 1
    return workdays

def ratioChange(start, end):
    ratio = (end - start) / start * 100
    return round(ratio, 2)