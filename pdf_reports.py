from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

from fastapi import HTTPException
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


def partnership_report(rows):
    font = 'AT2MReport'
    if font not in pdfmetrics.getRegisteredFontNames():
        candidates = [
            Path(__file__).parent / 'web/src/assets/fonts/RostelecomBasis-Regular.ttf',
            Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
        ]
        for path in candidates:
            if path.is_file():
                pdfmetrics.registerFont(TTFont(font, str(path)))
                break
        else:
            raise HTTPException(503, 'Не найден шрифт PDF с кириллицей. Восстановите web/src/assets/fonts/RostelecomBasis-Regular.ttf.')
    stream = BytesIO()
    doc = SimpleDocTemplate(stream, pagesize=landscape(A4), rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=20)
    title = ParagraphStyle('reportTitle', fontName=font, fontSize=14, leading=18, alignment=1)
    cell = ParagraphStyle('reportCell', fontName=font, fontSize=8, leading=11)
    head = ParagraphStyle('reportHead', parent=cell, textColor=colors.white)
    headers = ['ID', 'Вуз', 'ИТ-направление', 'Этап', 'Ответственный', 'Договор', 'Лицензия']
    data = [[Paragraph(escape(value), head) for value in headers]]
    data.extend([[Paragraph(escape(str(value or '—')), cell) for value in row] for row in rows])
    table = Table(data, colWidths=[30,160,145,145,120,105,doc.width-705], repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0),colors.HexColor('#7B2CBF')),
        ('VALIGN',(0,0),(-1,-1),'TOP'),
        ('GRID',(0,0),(-1,-1),0.5,colors.grey),
        ('TOPPADDING',(0,0),(-1,-1),6),
        ('BOTTOMPADDING',(0,0),(-1,-1),6),
    ]))
    doc.build([Paragraph('RTK CRM — Отчёт по взаимодействиям с вузами',title), Spacer(1,15),table])
    stream.seek(0)
    return stream
