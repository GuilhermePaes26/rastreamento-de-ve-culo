/* eslint-disable prettier/prettier */
import { Controller, Query, Get } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}
  @Get()
  findPlaces(@Query('text') text: string) {
    return this.placesService.findPlaces(text);
  }
}
